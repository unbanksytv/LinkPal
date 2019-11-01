docker build . -t paypal-adapter
docker run -d --name paypal-adapter-cont -p 8080:8080 -e EA_PORT=8080 paypal-adapter