const childProcess = require('child_process')
const path = require('path')

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, scriptPath)
    console.log('[INFO] Running script: ' + fullPath)

    const process = childProcess.fork(fullPath)
    let invoked = false

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
      if (invoked) return
      invoked = true
      reject(err)
    })

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
      if (invoked) return
      invoked = true
      const err = code === 0 ? null : new Error('exit code ' + code)
      err ? reject(err) : resolve()
    })
  })
}

async function runMigrations() {
  try {
    await runScript('./initialise_database.js')
    await runScript('./initialise_selfhosted.js')
    await runScript('./2023_05_19.js')
    await runScript('./2023_06_26.js')
    await runScript('./2023_10_13.js')
    await runScript('./2023_10_18.js')
    await runScript('./2024_03_30.js')
    await runScript('./selfhosted_2023_05_28.js')
    await runScript('./selfhosted_2023_10_11.js')
    await runScript('./selfhosted_2024_05_13.js')

    console.log('[INFO] SELFHOSTED MIGRATIONS FINISHED')
  } catch (err) {
    console.error('Error running migration:', err)
  }
}

runMigrations()
