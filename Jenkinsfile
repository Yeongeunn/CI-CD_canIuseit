pipeline {
    agent any

    environment {
        // Secret File을 가져오는 부분
        MY_ENV_FILE = credentials('MY_ENV_FILE')  // .env 파일의 Jenkins credentials ID
        NETWORK_NAME = 'canIuseit_network'
        DB_CONTAINER_NAME = 'canIuseit_dbc'
        WEB_CONTAINER_NAME = 'canIuseit_web'
        WEB_IMAGE_NAME = 'dppfls/caniuseit_web:1.0'
        JENKINS_SERVER_ADDR = '34.83.123.95'
    }

    stages {
        stage('Extract Env Variables') {
            steps {
                script {
                    writeFile file: '.env', text: readFile(MY_ENV_FILE)

                }
            }
        }
        stage('Create docker network') {
            steps {
                sh 'docker network create $NETWORK_NAME || true'
            }
        }

        stage('Run DB Container') {
            steps {
                script {
                    sh '''
                    docker run -d --name $DB_CONTAINER_NAME \
                    --network $NETWORK_NAME \
                    -e MYSQL_ROOT_PASSWORD=cancanii! \
                    -e MYSQL_DATABASE=canIuseit_db \
		    --default-authentication-plugin=mysql_native_password \
                    -p 3306:3306 mysql:8
                    '''
                }
            }
        }

        stage('Build Web Container') {
            steps {
                script {
                    sh 'docker build -t $WEB_IMAGE_NAME .'
                }
            }
        }

        stage('Run Web Container') {
            steps {
                script {
                    sh "docker run -d --name $WEB_CONTAINER_NAME --network $NETWORK_NAME -p 3000:3000 $WEB_IMAGE_NAME"
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh '''
                    echo "Checking container is available..."
                    docker ps
                    echo "Waiting for DB to initialize..."
                    sleep 20	
                    echo "Sending request to the server..."
		    docker logs $WEB_CONTAINER_NAME
		    RESPONSE=$(docker exec web_container curl --max-time 10 -s -w "%{http_code}" -o /dev/null http://localhost:3000)
		    if [ "$RESPONSE" -eq 200 ]; then
		    	echo "Server is running properly. HTTP Status: $RESPONSE"
		    else
    			echo "Test failed! HTTP Status: $RESPONSE"
		    fi
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up Docker resources...'
            sh '''
            docker stop $WEB_CONTAINER_NAME $DB_CONTAINER_NAME || true
            docker rm $WEB_CONTAINER_NAME $DB_CONTAINER_NAME || true
            docker rmi $WEB_IMAGE_NAME || true
            docker network rm $NETWORK_NAME || true
            '''
        }
    }
}
