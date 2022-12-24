/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ref } from "vue"

type TemplateOptions = {
  component: Record<string, any>
  slot?: string
  setup?: () => object
  template?: string
}

const generateTemplate = (options: TemplateOptions) => {
  const componentName = Object.keys(options.component)[0]

  if (componentName === undefined) {
    throw new Error("component SHOULD BE PROVIDED")
  }

  const component = options.component[componentName]

  const slot = options.slot ?? ""

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (args: any) => ({
    components: { [componentName]: component },
    setup: () => {
      const isShowButtons = ref(false)

      const toggleButtons = () => {
        isShowButtons.value = !isShowButtons.value
      }

      return {
        toggleButtons,
        isShowButtons,
        args,
        ...(options.setup?.() ?? {}),
      }
    },
    template: options.template ?? `
      <button v-if="isShowButtons" autofocus>Start</button>
      <div>
        <${componentName} v-bind="args">${slot}</${componentName}>
      </div>
      <button v-if="isShowButtons">Finish</button>
      <button v-if="false" autofocus style="position:absolute; margin-top: 20px;" @click="toggleButtons">
        Toggle buttons
      </button>
    `,
  })
}

const generateVariant = (Template: (...args: any) => any, args: Record<string, any>) => {
  const Variant = Template.bind({})

  // @ts-expect-error
  Variant.args = args

  return Variant
}

export const createVariant = generateVariant

export function createTemplate (options: TemplateOptions) {
  const Template = generateTemplate(options)

  const createVariantInner = (titleOrArgs: string | Record<string, any>, args?: Record<string, any>) => {
    let Variant: ReturnType<typeof generateVariant>

    if (typeof titleOrArgs === "string" && args !== undefined) {
      Variant = generateVariant(Template, args)
      // @ts-expect-error
      Variant.storyName = titleOrArgs
    }
    else if (typeof titleOrArgs === "object") {
      Variant = generateVariant(Template, titleOrArgs)
    }
    else {
      throw new Error("WRONG ARGUMENTS")
    }

    return Variant
  }

  return {
    Template,
    createVariant: createVariantInner,
  }
}
