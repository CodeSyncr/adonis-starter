import { args, flags } from '@adonisjs/core/build/standalone'
import { basename, join } from 'path'
import { StringTransformer } from '@adonisjs/ace/build/src/Generator/StringTransformer'
import { BaseGenerator } from '@adonisjs/assembler/build/commands/Make/Base'
import fs from 'fs'
import * as prettier from 'prettier'

export default class MakeJobTask extends BaseGenerator {
  /**
   * Required by BaseGenerator
   */
  protected suffix = 'Task'
  protected form = 'singular' as const
  protected pattern = 'pascalcase' as const
  protected resourceName: string
  protected createExact: boolean

  public static commandName = 'make:job:task'
  public static description =
    'create job task class, pass the name of object into singular form and priority of that job task'

  @args.string({ description: 'Name of the job task class' })
  public name: string

  @flags.string({ alias: 'priority', description: 'Provide Priority' })
  public priority: string

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  protected async templateData(): Promise<any> {
    const taskName = new StringTransformer(basename(this.name))
      .dropExtension()
      .changeForm('singular')
      .changeCase('pascalcase')
      .toValue()
    const route = `\r\n${taskName}: '${taskName}',\r\n`
    const routePath = join(__dirname, '..', 'app', 'Jobs', 'Tasks', 'index.ts')

    // Read the existing content of the file
    let fileContent = await fs.promises.readFile(routePath, 'utf-8')

    // Find the position of the last curly brace
    const lastCurlyBraceIndex = fileContent.lastIndexOf('}')

    // Insert the new line just before the last curly brace
    fileContent = [
      fileContent.slice(0, lastCurlyBraceIndex).trim(),
      route,
      fileContent.slice(lastCurlyBraceIndex),
    ].join('\n')

    //Format the content
    const formattedContent = await prettier.format(fileContent, {
      parser: 'typescript',
      trailingComma: 'all',
      singleQuote: true,
      semi: false,
    })

    // Write the updated content back to the file
    await fs.promises.writeFile(routePath, formattedContent)
    return { taskName }
  }

  protected getStub(): string {
    return join(__dirname, '..', 'templates', 'task.txt')
  }

  protected getDestinationPath(): string {
    return 'app/Jobs/Tasks/'
  }

  public async run() {
    this.resourceName = this.name
    await super.generate()
  }
}
