# How to use this repository ```todos-express-passport```
### First, you need to install nodejs and npm.
### Then you can use the following command to install the dependencies:
```bash
npm install
```
### You need to install mysql and phpmyadmin to run this project.
### If you use a docker container to run mysql, you can use the following command to start a mysql container:
### You can use the following command to start a mysql container:
```bash
docker run --name mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7
```
### Then you can use the following command to start a phpmyadmin container:
```bash
docker run --name phpmyadmin -d --link mysql:db -p 8080:80 phpmyadmin/phpmyadmin
```
### Now you can visit phpmyadmin at:
 ```
 http://localhost:8080
 ```

### But, if you not use docker, you can install mysql and phpmyadmin on your computer.
### Create a database named :
```
test
```
### To migrate the database, you can use the following command:
```bash
node shema.js
```

### Then to start the server, you can use the following command:
```bash
npm start
```
