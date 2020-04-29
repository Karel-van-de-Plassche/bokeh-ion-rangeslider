// The "core/properties" module has all the property types
import * as p from "core/properties"

// HTML construction and manipulation functions
import {div, input} from "core/dom"

// We will subclass in JavaScript from the same class that was subclassed
// from in Python
import {AbstractSlider, AbstractSliderView, SliderSpec} from "models/widgets/abstract_slider"
import {ControlView} from "models/widgets/control"

declare function jQuery(...args: any[]): any

export interface StringSliderSpec {
  start: number
  end: number
  value: number[]
  step: number
}

const prefix = 'bk-ionRange-'
prefix // Stop TS from complaining

export class IonRangeSliderView extends AbstractSliderView {
  model: IonRangeSlider

  protected value_el?: HTMLInputElement
  protected input_el: HTMLInputElement

  connect_signals(): void {
    // Workaround to call the grandparent connect_signals
    ControlView.prototype.connect_signals.call(this)

    const {direction, orientation, tooltips} = this.model.properties
    this.on_change([direction, orientation, tooltips], () => this.render())

    // TODO: implement connected signals
    //const {start, end, value, step, title} = this.model.properties
    //this.on_change([start, end, value, step], () => {
    //  const {start, end, value, step} = this._calc_to()
    //  this.noUiSlider.updateOptions({
    //    range: {min: start, max: end},
    //    start: value,
    //    step,
    //  })
    //})

    const {bar_color} = this.model.properties
    this.on_change(bar_color, () => {
      this._set_bar_color()
    })

    // TODO: Implement title update for ionRangeSlider
    // const {show_value} = this.model.properties
    // this.on_change([value, title, show_value], () => this._update_title())
  }

  _update_title(): void {
    console.error('_update_title should never be called by ionRangeSlider!')
  }

  protected _set_bar_color(): void {
    console.error('_set_bar_color should never be called by ionRangeSlider!')
  }

  protected _calc_to(): SliderSpec {
    return {
      start: this.model.start,
      end: this.model.end,
      value: this.model.value,
      step: this.model.step,
    }
  }

  protected _calc_from(values: number[]): number {
    console.error('_calc_from should never be called by ionRangeSlider!')
    values // Stop TS from complaining
    return NaN
  }

  protected _calc_from_ion(data: any): number[] | string[] {
    // Extract slider positions from ionRangeSlider data structure.
    // If 'values' was given and was an array of strings, these are strings
    // If 'values' was not given or an array of numbers, these are numbers
    // If values was given on initialization, data.from_value contains the value
    // of the slider. Else, the value is in the data.from attribute. This is 
    // different than documented, see https://github.com/IonDen/ion.rangeSlider/issues/639
    if (this.model.values == null) {
      if (data.to == null) {
        // single slider
        return data.from
      } else {
        // range slider
        return [data.from, data.to]
      }
    } else {
      if (data.to_value == null) {
        // single slider
        return data.from_value
      } else {
        // range slider
        return [data.from_value, data.to_value]
      }
    }
  }

  protected _set_keypress_handles(): void {
    console.error('_set_keypress_handles should never be called by ionRangeSlider!')
  }

  protected _keypress_handle(e: KeyboardEvent, idx: 0 | 1 = 0): void {
    console.error('_keypress_handle should never be called by ionRangeSlider!')
    e // Stop TS from complaining
    idx // Stop TS from complaining
  }


  render(): void {
    // BokehJS Views create <div> elements by default, accessible as @el.
    // Many Bokeh views ignore this default <div>, and instead do things
    // like draw to the HTML canvas. In this case though, we change the
    // contents of the <div>, based on the current slider value.

    // Workaround to call the grandparent render
    ControlView.prototype.render.call(this)

    const {start, end, value, step} = this._calc_to()

    // XXX: tooltips not implemented/applicable
    //let tooltips: boolean | any[] // XXX
    //if (this.model.tooltips) {
    //  const formatter = {
    //    to: (value: number): string => this.model.pretty(value),
    //  }

    //  tooltips = repeat(formatter, value.length)
    //} else
    //  tooltips = false

    if (this.slider_el == null) {
      // Slider does not exists, initialize
      this.input_el = input({type: "text"}) as any

      // TODO: Replace by bk_slider_title loaded from styles/widgets/sliders
      this.title_el = div({class: "bk-slider-title"})

      // TODO: Replace by bk_input_group loaded from styles/widgets/sliders
      // ionRangeSlider will make a span in the div containing this.input_el
      // It has to exists before calling .ionRangeSlider initializer
      this.group_el = div({class: "bk-input-group"}, this.title_el, this.input_el)
      this.el.appendChild(this.group_el)
      // Set up IonRangeSlider option based on
      const opts = {
        type: this.model.slider_type,
      } as any
      if (this.model.values == null) {
        // If values is not given, initialiaze slider from min, max and step
        opts.min  = start
        opts.max  = end
        opts.step = step
        opts.from = value[0]
        if (this.model.slider_type == 'double') {
          opts.to   = value[1]
        }
      } else {
        // If values is given min, max and step are ignored.
        // So in turn, bokeh's start, end and step are ignored.
        opts.values = this.model.values
        this.model.start = this.model.values[0]
        this.model.step = NaN
        this.model.end = this.model.values[this.model.values.length - 1]
        if (this.model.slider_type == 'double') {
          // start and end are interpreted as the starting values
          opts.from = opts.values.findIndex((val: string | number) => val == value[0])
          opts.to = opts.values.findIndex((val: string | number) => val == value[1])
        } else {
          opts.from = opts.values.findIndex((val: string | number | number[] | string[]) => val == value)
        }
        if (opts.from == -1) {
          console.warn("Requested model.value[0] not found in 'values' array")
          opts.from = undefined
        }
        if (opts.to == -1) {
          console.warn("Requested model.value[1] not found in 'values' array")
          opts.to = undefined
        }
      }
      opts.grid = this.model.grid // Enables grid of values under the slider
      opts.prettify_enabled = this.model.prettify_enabled // Enable ionRanges prettify functionality
      if (this.model.prettify)
        // Enable user supplied JS function
        opts.prettify = (f: any) => {return this._prettify(f) }

      opts.onChange = (values: any) => this._slide(values) // Triggers on values change
      opts.onFinish = (values: any) => this._change(values) // Triggers when user releases handle

      opts.force_edges = this.model.force_edges // Force ionRangeSlider to be inside its container
      opts.prefix = this.model.prefix // Prepend on handle before the value displayed
      opts.disable = this.model.disabled // Disable slider

      jQuery(this.input_el).ionRangeSlider(opts)

      //TODO: Changing color of the bars
      //$(this.el).find('.irs-bar').css('background', this.model.bar_color)
      //$(this.el).find('.irs-bar-edge').css('background', this.model.bar_color)
      //$(this.el).find('.irs-single').css('background', this.model.bar_color)
      for (var i = 0; i < this.group_el.children.length; i++) {
        var child = this.group_el.children[i] as HTMLElement
        var classes = child.classList
        if (classes.contains('irs')) {
          this.slider_el = child
          this.slider_el.style.width = '100%'
          break
        }
      }
    }
    if (this.value_el != null)
      this.value_el.value = `${value[0]} - ${value[1]}`
  }

  protected _slide(data: any): void {
    this.model.value = this._calc_from_ion(data)
  }

  protected _change(data: any): void {
    this.model.value = this._calc_from_ion(data)
    this.model.value_throttled = this.model.value
  }
  protected _prettify(data: any): void {
    if (this.model)
      if (this.model.prettify)
        return this.model.prettify.execute(data)
  }
}

export namespace IonRangeSlider {
  export type Attrs = p.AttrsOf<Props>

  export type Props = AbstractSlider.Props & {
    slider_type: p.Property<string>
    values: p.Property<string[]|number[]>
    grid: p.Property<boolean>
    prettify_enabled: p.Property<boolean>
    prettify: p.Property<any>
    force_edges: p.Property<boolean>
    prefix: p.Property<string>
  }
}

export interface IonRangeSlider extends IonRangeSlider.Attrs {}

export class IonRangeSlider extends AbstractSlider {
  properties: IonRangeSlider.Props

  constructor(attrs?: Partial<IonRangeSlider.Attrs>) {
    super(attrs)
  }

  static initClass(): void {
    // The ``type`` class attribute should generally match exactly the name
    // of the corresponding Python class.
    this.prototype.type = "IonRangeSlider"

    // If there is an associated view, this is boilerplate.
    this.prototype.default_view = IonRangeSliderView

    // The @define block adds corresponding "properties" to the JS model. These
    // should basically line up 1-1 with the Python model class. Most property
    // types have counterparts, e.g. bokeh.core.properties.String will be
    // p.String in the JS implementation. Where the JS type system is not yet
    // as rich, you can use p.Any as a "wildcard" property type.
    this.define<IonRangeSlider.Props>({
      slider_type:       [ p.String,      "single"     ],
      values:            [ p.Any,                      ],
      grid:              [ p.Boolean,              true       ],
      prettify_enabled:  [ p.Boolean,        true         ],
      prettify:          [ p.Any,         null         ],
      force_edges:       [ p.Boolean,        false        ],
      prefix:            [ p.String,      ""           ],
    })

    this.override({
      bar_color: '#ed5565',
      start: 0,
      end: 1,
      value: ['string0', 'string1'],
      step: 0.1,
      show_value: false,
      title: '',
    })
  }
}
IonRangeSlider.initClass()
