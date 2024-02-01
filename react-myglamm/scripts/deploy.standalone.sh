ROOT="${1:-m-web}"

if [[ $BITBUCKET_DEPLOYMENT_ENVIRONMENT == "web"* ]]; then ROOT="web"; fi

apk add --no-cache libc6-compat zip &&
corepack enable && 
corepack prepare pnpm@7.30.5 --activate &&
pnpm i --frozen-lockfile &&
NEXT_PUBLIC_ROOT=$ROOT pnpm env-cmd -f .env next build apps/$ROOT &&
cp .env build/$ROOT/.next/standalone &&
cp apikeys.json build/$ROOT/.next/standalone &&
cp -r apps/$ROOT/public build/$ROOT/.next/standalone/apps/$ROOT/public && 
cp -r global build/$ROOT/.next/standalone/apps/$ROOT/public/global && 
cp global/service-worker.js build/$ROOT/.next/standalone/apps/$ROOT/public/global &&
cd build/$ROOT/.next &&
cp -r static standalone/build/$ROOT/.next/static
