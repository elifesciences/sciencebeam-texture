elifePipeline {
    def commit

    node('containers-jenkins-plugin') {
        def image
        stage 'Checkout', {
            checkout scm
            commit = elifeGitRevision()
        }

        stage 'Build images', {
            checkout scm
            sh "IMAGE_TAG=${commit} docker-compose build"
            image = DockerImage.elifesciences(this, 'sciencebeam_texture', commit)
        }

        stage 'Project tests', {
            try {
                sh "./setup.sh"
                sh "IMAGE_TAG=${commit} docker-compose up -d --force-recreate"
                sh "docker-wait-healthy sciencebeam-texture_texture_1"
                sh "./project_tests.sh"
            } finally {
                sh "IMAGE_TAG=${commit} docker-compose down"
            }
        }

        elifeMainlineOnly {
            stage 'Push image', {
                image.push()                    
                image.tag('latest').push()
            }
        }
    }
}
