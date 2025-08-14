// Script para debugging de cookies en desarrollo
// Ejecutar en la consola del navegador

console.log('🍪 Debugging cookies de autenticación...');

// 1. Verificar todas las cookies
console.log('\n1. Todas las cookies:', document.cookie);

// 2. Buscar cookie de sesión específicamente
const sessionCookie = document.cookie
  .split(';')
  .find(cookie => cookie.trim().startsWith('session='));

console.log('\n2. Cookie de sesión:', sessionCookie);

// 3. Verificar localStorage
console.log('\n3. LocalStorage auth data:', localStorage.getItem('auth'));

// 4. Test manual del endpoint de autenticación
console.log('\n4. Testing /api/auth/me...');
fetch('/api/auth/me', {
  method: 'GET',
  credentials: 'include'
})
.then(response => response.json())
.then(data => {
  console.log('✅ Response from /api/auth/me:', data);
})
.catch(error => {
  console.log('❌ Error from /api/auth/me:', error);
});

// 5. Verificar headers de autenticación
console.log('\n5. Headers que se enviarían:');
const headers = new Headers();
headers.append('Content-Type', 'application/json');
console.log('Content-Type:', headers.get('Content-Type'));

// 6. Test manual con Authorization header
const authHeader = localStorage.getItem('token');
if (authHeader) {
  console.log('\n6. Authorization header found:', authHeader);
  fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authHeader}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ Response with header auth:', data);
  })
  .catch(error => {
    console.log('❌ Error with header auth:', error);
  });
} else {
  console.log('\n6. No Authorization header in localStorage');
}

console.log('\n🔍 Debugging completado. Revisa los resultados arriba.');

export {};