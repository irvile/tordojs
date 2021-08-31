import ora, { Ora } from 'ora'

/**
 * Logger Utility  to help control the console messages and make command testable
 */
class Logger {
  spinner: Ora = ora()
  rows: string[] = []

  loading(text: string) {
    this.rows.push(text)
    this.spinner.text = text
    this.spinner.start()
  }

  success(text: string) {
    this.rows.push(text)
    this.spinner.succeed(text)
  }

  warn(text: string) {
    this.rows.push(text)
    this.spinner.warn(text)
  }

  clear() {
    this.rows = []
  }
}

export default Logger
