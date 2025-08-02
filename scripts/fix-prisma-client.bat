@echo off
echo 🔧 Arreglando Prisma Client corrupto...

echo 📦 Deteniendo servidor de desarrollo...
taskkill /f /im node.exe 2>nul

echo 🗑️ Eliminando Prisma Client corrupto...
rmdir /s /q "node_modules\.prisma" 2>nul
rmdir /s /q "node_modules\@prisma\client" 2>nul

echo ⏱️ Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo 📦 Reinstalando Prisma Client...
npm install @prisma/client

echo 🔧 Regenerando Prisma Client...
npx prisma generate

echo ✅ ¡Prisma Client arreglado!
echo 🚀 Ahora ejecuta: npm run dev

pause