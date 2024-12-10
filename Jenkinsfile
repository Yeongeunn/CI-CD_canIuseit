pipeline {
    agent any

    environment {
        # 환경변수 목록
        MY_ENV_FILE = credentials('MY_ENV_FILE')
        NETWORK_NAME = 'mynetwork'  # 웹 컨테이너와 데이터베이스 컨테이너가 속할 도커 네트워크
        WEB_CONTAINER_NAME = 'web_container'
        WEB_IMAGE_NAME = '20221174/ci-cd'  # 본인의 도커 저장소/이미지 이름
        PROJECT_ID = 'open-source-software-435607'  # GCP 프로젝트 이름
        CLUSTER_NAME = 'cluster'  # GCP 클러스터
        LOCATION = 'us-central1-c'  # GCP 클러스터의 위치
        CREDENTIALS_ID = 'mygke'  # Jenkins credential에 저장한 Google Kubernetes Secret Key
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub')  # Jenkins credential에 저장한 본인의 도커 계정
    }

    stages {
        stage('Extract Env Variables') {
            steps {
                script {
                    # 환경변수 파일을 복사 후 Dockerfile에서 웹 컨테이너에 또 복사
                    sh "cat ${MY_ENV_FILE} > .env"
                }
            }
        }

        stage('Build Web Container') {
            steps {
                script {
                    myapp = docker.build("${env.WEB_IMAGE_NAME}:${env.BUILD_ID}")
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
                        echo "Waiting for server to start..."
                        sleep 10
                        
                        echo "Sending request to the server..."

                        # RESPONSE 변수에 curl을 통해 상태 코드를 저장
                        RESPONSE=$(docker exec $WEB_CONTAINER_NAME curl -s -w "%{http_code}" -o /dev/null http://localhost:3000)
                        
                        # 상태 코드가 200인지 확인
                        if [ "$RESPONSE" = "200" ]; then
                            echo "Server is running properly. HTTP Status: $RESPONSE"
                        else
                            echo "Test failed! HTTP Status: $RESPONSE"
                        fi
                        
                        # 컨테이너 로그 출력
                        echo "Logs from the container:"
                        docker logs $WEB_CONTAINER_NAME
                        
                        # 테스트 실패 시 종료
                        if [ "$RESPONSE" != "200" ]; then
                            exit 1
                        fi
                    '''
                }
            }
        }

         stage('Push Docker Image to Docker Hub') {
            when {
                expression { env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        myapp.push("latest")
                        myapp.push("${env.BUILD_ID}")
                    }
                }
            }
}

        stage('Deploy to GKE') {
            when {
                expression { env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    # 빌드 넘버로 이미지의 태그 지정
                    sh "sed -i 's#20221174/ci-cd:latest#20221174/ci-cd:${env.BUILD_ID}#g' deployment.yaml"
                    step([$class: 'KubernetesEngineBuilder', 
                          projectId: env.PROJECT_ID, 
                          clusterName: env.CLUSTER_NAME,
                          location: env.LOCATION, 
                          manifestPattern: 'deployment.yaml', 
                          credentialsId: env.CREDENTIALS_ID,
                          verifyDeployments: true])
                }
            }
        }
    }

    post {
    always {
            echo 'Cleaning up Docker resources...'
            sh '''
                docker stop $WEB_CONTAINER_NAME || true
                docker rm $WEB_CONTAINER_NAME || true
                docker rmi $WEB_IMAGE_NAME:$BUILD_ID
                docker rmi $WEB_IMAGE_NAME:latest
            '''
        }
    }
}
