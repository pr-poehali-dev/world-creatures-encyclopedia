import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get creatures list and details
    Args: event with httpMethod, queryStringParameters
    Returns: HTTP response with creatures data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters') or {}
    creature_id = params.get('id')
    category = params.get('category')
    search = params.get('search')
    user_id = event.get('headers', {}).get('X-User-Id')
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    is_premium = False
    if user_id:
        cur.execute(
            "SELECT premium_until FROM users WHERE id = %s",
            (int(user_id),)
        )
        premium_data = cur.fetchone()
        if premium_data and premium_data[0]:
            from datetime import datetime
            is_premium = datetime.fromisoformat(str(premium_data[0])) > datetime.now()
    
    if creature_id:
        cur.execute(
            "SELECT id, name, latin_name, category, description, habitat, diet, size_info, lifespan, conservation_status, image_url, premium_content FROM creatures WHERE id = %s",
            (int(creature_id),)
        )
        creature = cur.fetchone()
        
        if not creature:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Creature not found'})
            }
        
        result = {
            'id': creature[0],
            'name': creature[1],
            'latin_name': creature[2],
            'category': creature[3],
            'description': creature[4],
            'habitat': creature[5],
            'diet': creature[6],
            'size_info': creature[7],
            'lifespan': creature[8],
            'conservation_status': creature[9],
            'image_url': creature[10],
            'premium_content': creature[11] if is_premium else None
        }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result)
        }
    
    query = "SELECT id, name, latin_name, category, description, conservation_status, image_url FROM creatures WHERE 1=1"
    query_params = []
    
    if category:
        query += " AND category = %s"
        query_params.append(category)
    
    if search:
        query += " AND (name ILIKE %s OR latin_name ILIKE %s OR description ILIKE %s)"
        search_pattern = f"%{search}%"
        query_params.extend([search_pattern, search_pattern, search_pattern])
    
    query += " ORDER BY name"
    
    cur.execute(query, query_params)
    creatures = cur.fetchall()
    
    cur.close()
    conn.close()
    
    result = [{
        'id': c[0],
        'name': c[1],
        'latin_name': c[2],
        'category': c[3],
        'description': c[4][:200] + '...' if len(c[4]) > 200 else c[4],
        'conservation_status': c[5],
        'image_url': c[6]
    } for c in creatures]
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'creatures': result, 'is_premium': is_premium})
    }
