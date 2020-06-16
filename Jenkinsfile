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
            stage 'Merge to master', {
                elifeGitMoveToBranch commit, 'master'
            }

            stage 'Push unstable image', {
                def unstable_image = image.addSuffixAndTag('_unstable', commit)
                unstable_image.push()
                unstable_image.tag('latest').push()
            }
        }

        elifeTagOnly { tagName ->
            def releaseTag = tagName - "v"

            stage 'Push release image', {
                image.tag(releaseTag).push()
                image.tag('latest').push()
            }
        }
    }
}
