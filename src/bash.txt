sudo apt update
sudo apt install mysql-server -y
sudo apt upgrade -y
sudo systemctl start mysql.service

echo "DELETE FROM mysql.user WHERE User='';" >out.txt
echo "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');" >>out.txt
echo "DROP DATABASE IF EXISTS test;" >>out.txt
echo "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';" >>out.txt
echo "FLUSH PRIVILEGES;" >>out.txt
echo -n "CREATE USER 'app'@'localhost' IDENTIFIED WITH caching_sha2_password BY '" >>out.txt
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1 | tr -d '\n' >>out.txt
echo "';" >>out.txt
echo "GRANT INSERT, UPDATE, DELETE, SELECT on *.* TO 'app'@'localhost';" >>out.txt

mysql <out.txt
rm out.txt

