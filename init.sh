rm -rf node_modules/
git pull
npm ci
CANON_CONST_BASE='https://api.oec.world/tesseract/data' node --max_old_space_size=6000 `which npm` run build
pm2 restart ecosystem.config.js --update-env
pm2 save
