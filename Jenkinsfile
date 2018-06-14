//get common library inclusion
def Common = new odos.jenkins.Common()

def GIT_URL=scm.getUserRemoteConfigs()[0].getUrl()
def CONTAINER_NAME='td-ui'
def OPENSHIFT_ENV='odos-ii-test'
pipeline {
    agent any

    stages {
        stage('init'){
          steps{
            script{
              Common.runGitMerge('CI_Master', 'master')
              Common.slack "Build Started."
            }
          }
        }
        stage('Build') {
            steps {
              nodejs('stable') {
                script{
                  Common.slack 'Building...'
                  Common.jHipsterBuild()
                }
              }
            }
        }
        stage('liquibase') {
		  steps {
		  	script{
		      Common.slack 'Running liquibase baseline and update...'
		      withCredentials([usernamePassword(credentialsId: 'TEST_DB_USER_PASS', passwordVariable: 'TEST_DB_PASS', usernameVariable: 'TEST_DB_USER')]) {
		      sh """
		      ./gradlew baseline liquibaseUpdate -PdatabaseHost=${TEST_DB_HOST} -PdatabaseAdmin=${TEST_DB_USER} -PdatabasePassword=${TEST_DB_PASS}
		      """
		        }
		      }
		    }
		}
        stage('Sonar Scan') {
          steps {
            script{
              Common.slack 'Sonar Scan and Upload...'
              Common.sonarScan()
            }
          }
        }
        stage('Fortify Scan') {
            steps {
              script{
                Common.slack 'Fortify Scan...'
                Common.fortify('src','reports')
              }
            }
        }
        stage('Build Container') {
            steps {
              script{
                Common.slack 'Packaging into a container...'
                Common.buildContainer("${CONTAINER_NAME}")
              }
            }
        }
        stage('Twistlock Scan') {
            steps {
              script{
                Common.slack 'Twistlock Scan...'
                Common.twistlock('localhost:5000', "${CONTAINER_NAME}",'latest')
              }
            }
        }
        stage('Push Container') {
            steps {
              script{
                Common.slack 'Push to Docker Registry..'
                Common.pushContainer("${CONTAINER_NAME}")
              }
            }
        }
        stage('Test Deploy') {
            steps {
              script{
                Common.slack 'Deploying to Test Environment...'
                Common.deployToOpenShift('odos-ii-test',"${CONTAINER_NAME}",'latest')
              }
            }
        }
        stage('FT') {
            steps {
              script{
                Common.slack 'Functional Testing...'
              }
            }
        }
        stage('PT') {
            steps {
              script{
                Common.slack 'Performance Testing...'
              }
            }
        }
        stage('Merge') {
            steps {
              script{
                Common.slack 'Merge to master branch...'
                Common.runGitPush('master')
              }
            }
        }
        stage('PP Deploy') {
            steps {
              script{
                Common.slack 'Deploying to PreProd Environment...'
              }
            }
        }

    }
}
