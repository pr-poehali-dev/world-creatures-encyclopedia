import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Shop operations - get items and purchase
    Args: event with httpMethod, body for purchases
    Returns: HTTP response with items or purchase result
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    if method == 'GET':
        user_id = event.get('headers', {}).get('X-User-Id')
        
        cur.execute("SELECT id, name, description, price, effect, icon_name FROM items ORDER BY price")
        items = cur.fetchall()
        
        user_items = {}
        if user_id:
            cur.execute(
                "SELECT item_id, quantity FROM user_items WHERE user_id = %s",
                (int(user_id),)
            )
            user_items_data = cur.fetchall()
            user_items = {item[0]: item[1] for item in user_items_data}
        
        cur.close()
        conn.close()
        
        result = [{
            'id': item[0],
            'name': item[1],
            'description': item[2],
            'price': item[3],
            'effect': item[4],
            'icon_name': item[5],
            'owned': user_items.get(item[0], 0)
        } for item in items]
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'items': result})
        }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        user_id = body_data.get('user_id')
        item_id = body_data.get('item_id')
        
        cur.execute("SELECT insectomix_balance FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        
        if not user:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'User not found'})
            }
        
        balance = user[0]
        
        cur.execute("SELECT price FROM items WHERE id = %s", (item_id,))
        item = cur.fetchone()
        
        if not item:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Item not found'})
            }
        
        price = item[0]
        
        if balance < price:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Insufficient balance'})
            }
        
        cur.execute(
            "UPDATE users SET insectomix_balance = insectomix_balance - %s WHERE id = %s",
            (price, user_id)
        )
        
        cur.execute(
            "SELECT quantity FROM user_items WHERE user_id = %s AND item_id = %s",
            (user_id, item_id)
        )
        existing = cur.fetchone()
        
        if existing:
            cur.execute(
                "UPDATE user_items SET quantity = quantity + 1 WHERE user_id = %s AND item_id = %s",
                (user_id, item_id)
            )
        else:
            cur.execute(
                "INSERT INTO user_items (user_id, item_id, quantity) VALUES (%s, %s, 1)",
                (user_id, item_id)
            )
        
        conn.commit()
        
        cur.execute("SELECT insectomix_balance FROM users WHERE id = %s", (user_id,))
        new_balance = cur.fetchone()[0]
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'new_balance': new_balance})
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }