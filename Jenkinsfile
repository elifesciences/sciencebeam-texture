elifePipeline {
    def commit

    elifeOnNode(
        {
            stage 'Checkout', {
                checkout scm
                commit = elifeGitRevision()
            }

            stage 'Build images', {
                checkout scm
                sh "docker-compose build"
            }

            stage 'Project tests', {
                try {
                    sh "docker-compose up"
                    sh "./project_tests.sh"
                } finally {
                    sh "docker-compose down"
                }
            }
        },
        'containers--medium'
    )
}
