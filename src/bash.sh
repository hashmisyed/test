sudo apt update
sudo apt install mysql-server -y
sudo apt upgrade -y
sudo systemctl start mysql.service

sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx HTTP'


echo "DELETE FROM mysql.user WHERE User='';" >out.txt
echo "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');" >>out.txt
echo "DROP DATABASE IF EXISTS test;" >>out.txt
echo "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';" >>out.txt
echo "FLUSH PRIVILEGES;" >>out.txt
echo "CREATE USER IF NOT EXISTS 'app'@'localhost' IDENTIFIED WITH caching_sha2_password;" >>out.txt
echo "GRANT EXECUTE on *.* TO 'app'@'localhost';" >>out.txt



mysql <out.txt
rm out.txt

sudo apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs
node -v

sudo pm2 completion install
sudo npm install pm2@latest -g && pm2 update

pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u sammy --hp /home/sammy
sudo systemctl start pm2-sammy
systemctl status pm2-sammy

pm2 start bashscript.sh --name '3u' --interpreter bash

# bashscript.sh
set +o history
random_string=$(tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32) >/dev/null2 >&1
export DB_PWD="$random_string" >/dev/null2 >&1
echo "ALTER USER 'app'@'localhost' IDENTIFIED BY '$random_string';" >out.txt
mysql <out.txt
rm out.txt
random_string=""
nodejs app.js $random_string
set -o history

mkdir /admin/ 
cd /admin/
git fetch https://username:password@github.com/3u/logging #read-access only to repo
git reset --hard



