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
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                script {
                    dockerImage = "thuyein96/${APP_NAME}:latest"
                    echo "Building Docker image: ${dockerImage}"
                    sh "docker build -f Dockerfile -t ${dockerImage} ."
                }
            }
        }

        stage('Push to Docker Hub') {
            withCredentials([usernamePassword(credentialsId: 'dockerhublogin', 
                                                   usernameVariable: 'DOCKER_USER', 
                                                   passwordVariable: 'DOCKER_PASS')]) {
                script {
                    echo "Logging in to Docker Hub..."
                    // Log in using 'sh'
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"

                    echo "Pushing image: ${dockerImage}"
                    // Push using 'sh'
                    sh "docker push ${dockerImage}"
                }
            }
        }

    //     stage('Deploy to Kubernetes') {
    //         steps {
    //             script {
    //                 // Option A: using the Kubernetes plugin (kubeconfigId must exist in Jenkins)
    //                 // kubernetesDeploy(configs: "deploymentservice.yml", kubeconfigId: "kubernetes")

    //                 // Option B: using kubectl with a kubeconfig credential (recommended if plugin not installed)
    //                 // Replace 'kubeconfig-cred-id' with your Jenkins credential id that stores the kubeconfig file
    //                 kubernetesDeploy(configs: "deploymentservice.yml", kubeconfigId: "kubernetes")
    //             }
    //         }
    //     }
    // }

    // post {
    //     always {
    //         script {
    //             echo "Cleaning up local Docker image..."
    //             sh "docker rmi ${env.IMAGE_NAME} || true"
    //             echo "Logging out from Docker Hub..."
    //             sh "docker logout || true"
    //         }
    //     }
    // }
    }
}
