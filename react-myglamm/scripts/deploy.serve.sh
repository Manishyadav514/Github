ROOT="${2:-m-web}"

pnpm build:$1 $2 $3 && 
NEXT_PUBLIC_VENDOR_CODE="${3:-mgp}" NEXT_PUBLIC_ROOT=$ROOT DEV_MODE=true env-cmd -f env/$ROOT/.$1.env next start apps/$ROOT
  