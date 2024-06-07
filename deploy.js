import { promisify } from 'util';
import { exec as execAsync } from 'child_process';
import * as cp from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const exec = promisify(execAsync);
const exec2 = cp.exec;

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// main constants
const doVerbose = true;
const service = '<project-name>';
const projectPrefix = '<project-name>-backend-';
const region = 'us-central1';
const dockerRepository = 'deploy';
const supportedEnv = {
  dev: {
    env: 'development',
    memory: '2Gi',
    cpu: 1,
    min_instances: 0,
  },
  staging: {
    env: 'staging',
    memory: '2Gi',
    cpu: 1,
    min_instances: 0,
  },
  prod: {
    env: 'production',
    memory: '2Gi',
    cpu: 1,
    min_instances: 0,
  },
};

// read the parameters
let env = 'dev';
let orgId = 'ypo';
for (let i = 2; i < process.argv.length; i++) {
  // ENV?
  if (process.argv[i].startsWith('--env=') == true) {
    env = process.argv[i].replace('--env=', '').toLowerCase();
  }
  // ORG?
  else if (process.argv[i].startsWith('--org=') == true) {
    orgId = process.argv[i].replace('--org=', '').toLowerCase();
  }
}

// verify them
if (supportedEnv.hasOwnProperty(env) == false) {
  env = 'dev';
}
if (orgId == '') {
  orgId = 'ypo';
}

// do it
deploy(env, orgId);

async function deploy(_env, _orgId) {
  // default machine setup
  let envFullString = supportedEnv[_env].env;
  let memory = supportedEnv[_env].memory;
  let cpu = supportedEnv[_env].cpu;
  let minInstances = supportedEnv[_env].min_instances;

  // set up the different variables we're going to need
  let envFilePath = 'config/org/' + _orgId + '/.env.' + _env;
  let project = projectPrefix + _env;
  // let imageName = (service + '-' + _orgId).replaceAll('_', '-')
  let imageName = service.replaceAll('_', '-');
  let dockerName = imageName + ':' + _env;
  let dockerHost = region + '-docker.pkg.dev';
  let dockerUrl =
    dockerHost +
    '/' +
    project +
    '/' +
    dockerRepository +
    '/' +
    imageName;
  let ret = true;

  console.log('---------------------------------------------------');
  console.log('\tDeploying: ' + service);
  console.log('---------------------------------------------------');
  console.log('-- organization: ' + _orgId);
  console.log('-- environment: ' + envFullString + ' (' + _env + ')');
  console.log('-- .env file: ' + envFilePath);
  console.log('-- GCP project: ' + project);
  console.log('-- Docker image URL: ' + dockerUrl);
  console.log('-- memory: ' + memory);
  console.log('-- cpu: ' + cpu);
  console.log('-- min instances: ' + minInstances);
  console.log('-- dir name: ' + __dirname);
  console.log('-- command: ' + process.cwd());
  console.log('---------------------------------------------------');

  // copy the .env file
  try {
    console.log('1. Copying ' + envFilePath + ' to .env...');
    await cmd('cp ' + envFilePath + ' .env', doVerbose);

    // show it?
    if (doVerbose == true) {
      await cmd('cat .env');
    }
  } catch (e) {
    console.log(
      '--> ERROR: problem copying the .env file: ' +
        envFilePath +
        '! Make sure it exists!'
    );
    return false;
  }

  // build the docker image
  try {
    console.log('4. Building the Docker image...');
    let buildResponse = await cmd3(
      'docker build --no-cache --build-arg ENV=' +
        envFullString +
        ' -t ' +
        dockerName +
        ' .'
    );
    console.log(buildResponse);
  } catch (e) {
    console.log(e);
    console.log(e.stack);
    console.log(
      '--> ERROR: running: ' +
        'docker build --no-cache --build-arg ENV=' +
        envFullString +
        ' -t ' +
        dockerName +
        ' .'
    );
    return false;
  }

  // tag the docker image
  try {
    console.log('5. Tagging the image...');
    await cmd(
      'docker tag ' + dockerName + ' ' + dockerUrl,
      doVerbose
    );
  } catch (e) {
    console.log(e);
    console.log(e.stack);
    console.log(
      '--> ERROR: running: ' +
        'docker tag ' +
        dockerName +
        ' ' +
        dockerUrl
    );
    return false;
  }

  // push it to the cloud
  try {
    console.log('6. Uploading the image...');
    await cmd('docker push ' + dockerUrl, doVerbose);
  } catch (e) {
    console.log(e);
    console.log(e.stack);
    console.log('--> ERROR: running: ' + 'docker push ' + dockerUrl);
    return false;
  }

  // deploy it
  try {
    console.log('7. Deploying the image...');
    await cmd(
      'gcloud run deploy ' +
        imageName +
        ' --image ' +
        dockerUrl +
        ':latest --platform=managed --region=' +
        region +
        ' --allow-unauthenticated --memory=' +
        memory +
        ' --min-instances=' +
        minInstances +
        ' --cpu=' +
        cpu,
      doVerbose
    );
  } catch (e) {
    console.log(e);
    console.log(e.stack);
    console.log('--> ERROR: deploying!');
    ret = false;
  }

  if (ret == true) console.log('Service is ready!');
  else console.log('Error deploying!');

  return ret;
}

let download = async function (uri, filename) {
  let command = `curl -o ${filename}  '${uri}'`;
  let result = cp.execSync(command);
  return result;
};

async function cmd(cmd_str, log) {
  if (log !== false) {
    console.log(cmd_str);
  }

  let result = await exec(cmd_str, {
    maxBuffer: 5 * 1024 * 1024,
  });

  if (log !== false) {
    console.log(result);
  }
}

async function cmd3(cmd_str, log) {
  return new Promise((resolve, reject) => {
    let childProcess = exec2(cmd_str, (error, stdout, stderr) => {
      // When the process completes:
      if (error) {
        console.log(`${error.name}: ${error.message}`);
        console.log(`[STACK] ${error.stack}`);
      }

      console.log(stdout);
      console.log(stderr);
      resolve(true);
    });

    childProcess.stdout.on('data', (data) => console.log(data));
    childProcess.stderr.on('data', (data) =>
      console.log(`[ERROR]: ${data}`)
    );
    // childProcess.stdout.pipe( process.stdout );
  });
}
