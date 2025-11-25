// lib/userIdManager.ts
"use client"

import { v4 as uuidv4 } from "uuid"

const USER_ID_KEY = 'temp_user_id'

/**
 * Obtiene o crea un ID de usuario temporal almacenado en el cliente.
 * Este ID persiste durante la sesión del navegador.
 */
export function getUserId(): string {
  // Solo funciona en el cliente
  if (typeof window === 'undefined') {
    return ''
  }

  let userId = localStorage.getItem(USER_ID_KEY)
  
  if (!userId) {
    userId = `USER_${uuidv4()}`
    localStorage.setItem(USER_ID_KEY, userId)
  }
  
  return userId
}

/**
 * Elimina el ID de usuario (útil para testing o logout)
 */
export function clearUserId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_ID_KEY)
  }
}

/**
 * Verifica si existe un ID de usuario
 */
export function hasUserId(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return localStorage.getItem(USER_ID_KEY) !== null
}