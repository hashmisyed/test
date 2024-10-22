sudo apt update
sudo apt install mysql-server -y
sudo apt upgrade -y
sudo systemctl start mysql.service


echo "DELETE FROM mysql.user WHERE User='';" >out.txt
echo "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');" >>out.txt
echo "DROP DATABASE IF EXISTS test;" >>out.txt
echo "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';" >>out.txt
echo "FLUSH PRIVILEGES;" >>out.txt
echo "CREATE USER IF NOT EXISTS 'app'@'localhost' IDENTIFIED WITH caching_sha2_password;" >>out.txt
echo "GRANT INSERT, UPDATE, DELETE, SELECT on *.* TO 'app'@'localhost';" >>out.txt

mysql <out.txt
rm out.txt

random_string=$(tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)
export DB_PWD="$random_string"
echo "ALTER USER 'app'@'localhost' IDENTIFIED BY '$random_string';" >out.txt
mysql <out.txt
rm out.txt
random_string=""

sudo apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs
node -v

sudo pm2 completion install
sudo npm install pm2@latest -g && pm2 update
pm2 start hello.js
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u sammy --hp /home/sammy
sudo systemctl start pm2-sammy
systemctl status pm2-sammy

npm install pm2 -g