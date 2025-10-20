import json
import os
import hashlib
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication and registration
    Args: event with httpMethod, body
    Returns: HTTP response with user data or error
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    action = body_data.get('action')
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    if action == 'register':
        email = body_data.get('email')
        password = body_data.get('password')
        username = body_data.get('username')
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        cur.execute(
            "INSERT INTO users (email, password_hash, username, insectomix_balance) VALUES (%s, %s, %s, 0) RETURNING id, email, username, insectomix_balance",
            (email, password_hash, username)
        )
        user = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'user': {
                    'id': user[0],
                    'email': user[1],
                    'username': user[2],
                    'insectomix_balance': user[3],
                    'is_premium': False
                }
            })
        }
    
    elif action == 'login':
        email = body_data.get('email')
        password = body_data.get('password')
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        cur.execute(
            "SELECT id, email, username, insectomix_balance, premium_until FROM users WHERE email = %s AND password_hash = %s",
            (email, password_hash)
        )
        user = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid credentials'})
            }
        
        from datetime import datetime
        is_premium = user[4] and datetime.fromisoformat(str(user[4])) > datetime.now() if user[4] else False
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'user': {
                    'id': user[0],
                    'email': user[1],
                    'username': user[2],
                    'insectomix_balance': user[3],
                    'is_premium': is_premium,
                    'premium_until': str(user[4]) if user[4] else None
                }
            })
        }
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Invalid action'})
    }
