#!/bin/bash

HELP_TEXT="  dev.sh - Run the zosia docker containers for local development.
    ./dev.sh [command] [option]...

Commands:
  one_click       - Runs zosia website (on 127.0.0.1:8000)
  setup           - Spins up the containers and prepares development enviromanet
  shell           - Runs Bash shell inside the container
  runserver       - Runs django development server inside the container
  py_install      - Installs python dependencies specified in requirements.txt
  js_install      - Installs javascript depedencies specified in package.json
  js_watch        - Rebuilds javascript on file change (note: may create files on host fs with root permissions)
  js_build        - Builds javascript (note: may create files on host fs with root permissions)
  migrate         - Applies migrations of django application
  makemigrations  - Generates django migrations from models (note: may create files on host fs with root permissions)
  shutdown        - Kills and deletes containers

Options:
  --no-cache      - Do not use cache when building the container image.
"

# colors :P
red=$(tput setaf 1)
purple=$(tput setaf 5)
green=$(tput setaf 2)
bold=$(tput bold)
normal=$(tput sgr0)


function configure_env () {
  local cwd=$(pwd)
  cd $(dirname "$0")
  SCRIPT_PATH=$(pwd)
  cd ../
  ROOT_PATH=$(pwd)
  cd "${cwd}"
  DOCKER_COMPOSE="${ROOT_PATH}/docker-compose.dev.yml"
  PROJECT_NAME="zosia"
  WEB_CONTAINER_NAME="${PROJECT_NAME}_web_1"
}

configure_env

function build() {
  docker-compose -f ${DOCKER_COMPOSE} build ${NO_CACHE}
}

function shell() {
  docker exec -it ${WEB_CONTAINER_NAME} /bin/bash
}

function run() {
  docker exec -it ${WEB_CONTAINER_NAME} /bin/bash -c "$1"
}

function js_install () {
  run "yarn install"
}

function js_watch () {
  run "yarn watch"
}

function js_build () {
  run "yarn build"
}

function py_install () {
  run "pip install -r requirements.txt"
}

function makemigrations() {
  run "python src/manage.py makemigrations"
}

function migrate () {
  run "python src/manage.py migrate"
}

function runserver () {
  run "python src/manage.py runserver 0.0.0.0:8000"
}

function setup () {
  build
  docker-compose -f ${DOCKER_COMPOSE} -p ${PROJECT_NAME} up -d
  js_install
  js_build
  py_install
}

function shutdown () {
  docker-compose -f ${DOCKER_COMPOSE} -p ${PROJECT_NAME} down
}

function one_click () {
  echo "${bold}-- Setup container --${normal}"
  setup
  echo "${bold}-- Run migrations --${normal}"
  migrate
  echo "${bold}-- Run webserver --${normal}"
  runserver
  echo "${bold}-- Exiting - ${purple}If you finished remember to run \`./dev.sh shutdown\`${normal}"
  docker ps
}

[[ "$#" -eq 0 ]] && echo "${HELP_TEXT}" && exit 0

command="$1"
shift

while true
do
  case "$1" in
    --no-cache)
    NO_CACHE="--no-cache"
    ;;
    "")
    break
    ;;
    *)
    echo "Unknown option $1"
    echo "${HELP_TEXT}"
    exit 1
    ;;
  esac

  shift
done

case $command in
  one_click)
  one_click
  ;;
  setup)
  setup
  ;;
  runserver)
  runserver
  ;;
  py_install)
  py_install
  ;;
  shell)
  shell
  ;;
  js_watch)
  js_watch
  ;;
  js_build)
  js_build
  ;;
  js_install)
  js_install
  ;;
  shutdown)
  shutdown
  ;;
  migrate)
  migrate
  ;;
  makemigrations)
  makemigrations
  ;;
  *)
  echo "Unknown command $command"
  echo "$HELP_TEXT"
  exit 1
  ;;
esac
