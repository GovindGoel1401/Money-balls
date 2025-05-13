pipeline{
    agent any
    stages{
        stage('Code'){
            steps{
                git branch: 'main', url: 'https://github.com/GovindGoel1401/Money-balls.git'
            }
        }
        stage('Build'){
            steps{
                sh 'docker build . -t TrainWithGovind/money-ball:latest'
            }
        }
      stage('Push'){  
    steps{
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'dockerhubUser', passwordVariable: 'dockerhubPassword')]) {
            sh '''
                echo "$dockerhubPassword" | docker login -u "$dockerhubUser" --password-stdin
                docker push trainwithgovind/money-ball:latest
            '''
        }  
    }
}

        stage('Test'){
            steps{
                echo "Testing"
            }
        }
        stage('Deploy'){
            steps{
                sh 'docker-compose down && docker-compose up -d'
            }
        }
    }
}
