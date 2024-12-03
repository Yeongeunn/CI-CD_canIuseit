pipeline {
    agent any

    environment {
        NETWORK_NAME = 'caniuseit-network'
        DB_CONTAINER_NAME = 'caniuseit-database'
        WEB_CONTAINER_NAME = 'web-container'
        WEB_IMAGE_NAME = 'ci-cd_caniuseit'
    }

    stages {
        stage('Create docker network') {
            steps {
                sh 'docker network create $NETWORK_NAME | true'
            }
        }


        stage('Run DB Container') {
            steps {
                script {
                    // 데이터베이스 컨테이너 실행
                    sh '''
                    docker run -d --name $DB_CONTAINER_NAME \
                    --network $NETWORK_NAME \
                    -e MYSQL_ROOT_PASSWORD=cancanii! \
                    -e MYSQL_DATABASE=canIuseit_db \
                    -p 3306:3306 mysql:8
                    '''
                }
            }
        }

        stage('Build Web Container') {
            steps {
                script {
                    // 웹 컨테이너 빌드
                    sh 'docker build -t $WEB_IMAGE_NAME .'
                }
            }
        }

        stage('Run Web Container') {
            steps {
                script {
                    // 웹 컨테이너 실행 (DB와 연결)
                    sh "docker run -d --name $WEB_CONTAINER_NAME --network $NETWORK_NAME -p 3000:3000 $WEB_IMAGE_NAME"
                }
            }
        }

        stage('Test') {
            steps {
                script {
         sh "echo 4"
                }
            }
        }

        stage('Clean up') {
            steps {
                script {
                    // 컨테이너 종료 및 이미지 삭제 (선택사항)
                    sh "docker stop $WEB_CONTAINER_NAME $DB_CONTAINER_NAME"
                    sh "docker rm $WEB_CONTAINER_NAME $DB_CONTAINER_NAME"
                    sh "docker rmi $WEB_IMAGE_NAME"
                }
            }
        }
    }
}


