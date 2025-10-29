pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'thuyein96'
        APP_NAME = 'nextjs-app'
        K8S_DEPLOYMENT_NAME = 'nextjs-app-deployment'
        K8S_CONTAINER_NAME = 'nextjs-app-container'
        dockerImage = ''
        // Do not rely on interpolation here; compute IMAGE_NAME at runtime in a script block
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/thuyein96/next_mongo.git'
            }
        }

        stage('Build Image') {
            steps {
                script {
                    env.IMAGE_NAME = "${env.DOCKERHUB_USERNAME}/${env.APP_NAME}"
                    echo "Building Docker image: ${env.IMAGE_NAME}"
                    dockerImage = docker.build("${env.IMAGE_NAME} .")
                }
            }
        }

        stage('Push to Docker Hub') {
            environment {
                REGISTRY_CREDENTIAL = 'dockerhublogin'
            }
            steps {
                script {
                    // Push using the docker pipeline API; dockerImage must be defined in Build stage
                    docker.withRegistry('https://registry.hub.docker.com', REGISTRY_CREDENTIAL) {
                        dockerImage.push('latest')   // pushes the 'latest' tag
                        // Optionally push other tags:
                        // dockerImage.push("v1.0.0")
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Option A: using the Kubernetes plugin (kubeconfigId must exist in Jenkins)
                    // kubernetesDeploy(configs: "deploymentservice.yml", kubeconfigId: "kubernetes")

                    // Option B: using kubectl with a kubeconfig credential (recommended if plugin not installed)
                    // Replace 'kubeconfig-cred-id' with your Jenkins credential id that stores the kubeconfig file
                    kubernetesDeploy(configs: "deploymentservice.yml", kubeconfigId: "kubernetes")
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Cleaning up local Docker image..."
                sh "docker rmi ${env.IMAGE_NAME} || true"
                echo "Logging out from Docker Hub..."
                sh "docker logout || true"
            }
        }
    }
}
