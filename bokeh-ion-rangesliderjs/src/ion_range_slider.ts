//import {throttle} from "core/util/callback"

// The "core/properties" module has all the property types
import * as p from "core/properties"

// HTML construction and manipulation functions
import {div, input} from "core/dom"

import {SliderCallbackPolicy} from "core/enums"

// We will subclass in JavaScript from the same class that was subclassed
// from in Python
import {AbstractSlider, AbstractSliderView, SliderSpec} from "models/widgets/abstract_slider"
import {ControlView} from "models/widgets/control"
import {throttle} from "core/util/callback"
throttle // Stop TS from complaining

declare function jQuery(...args: any[]): any

const prefix = 'bk-ionRange-'
prefix // Stop TS from complaining

export interface StringSliderSpec {
  start: number
  end: number
  value: number[]
  step: number
}

export class IonRangeSliderView extends AbstractSliderView {
  model: IonRangeSlider

  protected value_el?: HTMLInputElement

  connect_signals(): void {
    // Workaround to call the grandparent connect_signals
    ControlView.prototype.connect_signals.call(this)

    const {callback, callback_policy, callback_throttle} = this.model.properties
    this.on_change([callback, callback_policy, callback_throttle], () => this._init_callback())

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

    //this.on_change([value, title], () => this._update_title())
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

  protected _calc_from(values: number[]): number | number[] {
    console.error('_calc_from should never be called by ionRangeSlider!')
    values // Stop TS from complaining
    return NaN
  }

  protected _calc_from_ion(data: any): number | number[] | string | string[] {
    // Extract slider positions from ionRangeSlider data structure.
    // If 'values' was given and was an array of strings, these are strings
    // If 'values' was not given or an array of numbers, these are numbers
    console.log(typeof data.from_value)
    if (data.to_value == null) {
      // single slider
      return data.from_value
    } else {
      // range slider
      return [data.from_value, data.to_value]
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
    //if (this.model.tooltips) {
    //  const formatter = {
    //    to: (value: number): string => this.model.pretty(value),
    //  }

    //  tooltips = repeat(formatter, value.length)
    //} else
    //  tooltips = false
    //const [from, to] = this.model.range || [max, min]
    const from = value[0]
    const to = value[1]
    if (this.slider_el == null) {
      // Slider does not exists, initialize
      this.slider_el = input({type: "text"}) as any
      this.el.appendChild(div({style: {width: "100%"}}, this.slider_el))
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
        opts.to   = value[1]
      } else {
        // If values is given min, max and step are ignored.
        opts.values = this.model.values
        opts.from = opts.values.findIndex((val: string | number) => val == value[0])
        opts.to = opts.values.findIndex((val: string | number) => val == value[1])
      }
      opts.prettify_enabled = this.model.prettify_enabled // Enable ionRanges prettify functionality
      if (this.model.prettify)
        // Enable user supplied JS function
        opts.prettify = (f: any) => {return this._prettify(f) }
      opts.grid = this.model.grid // Enables grid of values under the slider

      opts.onChange = (values: any) => this._slide(values) // Triggers on values change
      //opts.onChange = function (data: any) {
      //      console.dir(data);
      //  }
      //opts.onFinish = (_, __, values) => this._change(values) // Triggers when user releases handle

      opts.force_edges = this.model.force_edges // Force ionRangeSlider to be inside its container
      opts.prefix = this.model.prefix // Prepend on handle before the value displayed
      opts.disable = this.model.disabled // Disable slider

      //this.value_type = typeof value[0] // Save if the value is a number or a string
      jQuery(this.slider_el).ionRangeSlider(opts)
      if (this.value_el != null)
        this.value_el.value = `${from} - ${to}`
    }
  }

  protected _slide(data: any): void {
    this.model.value = this._calc_from_ion(data)
    if (this.callback_wrapper != null)
      this.callback_wrapper()
  }

  protected _change(data: any): void {
    this.model.value = this._calc_from_ion(data)
    this.model.value_throttled = this.model.value
    switch (this.model.callback_policy) {
      case 'mouseup':
      case 'throttle': {
        if (this.model.callback != null)
          this.model.callback.execute(this.model)
        break
      }
    }
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
    values: p.Property<string|string[]|number|number[]>
    //range: p.Property<[number, number]>
    start: p.Property<number>
    end: p.Property<number>
    step: p.Property<number>
    grid: p.Property<boolean>
    prettify_enabled: p.Property<boolean>
    prettify: p.Property<any>
    force_edges: p.Property<boolean>
    prefix: p.Property<string>
    callback_throttle: p.Property<number>
    callback_policy: p.Property<SliderCallbackPolicy>
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
      //range:             [ p.Any                              ],
      //start:             [ p.Number,               0          ],
      //end:               [ p.Number,               1          ],
      //step:              [ p.Number,               0.1        ],
      grid:              [ p.Boolean,              true       ],
      prettify_enabled:  [ p.Boolean,        true         ],
      prettify:          [ p.Any,         null         ],
      force_edges:       [ p.Boolean,        false        ],
      prefix:            [ p.String,      ""           ],
      //callback_throttle: [ p.Number,               200        ],
      //callback_policy:   [ p.SliderCallbackPolicy, "throttle" ],
    })

    this.override({
      bar_color: '#ed5565',
      start: 0,
      end: 1,
      value: ['fish', 'pie'],
      step: 0.1,
      show_value: false,
      title: '',
      callback_policy: 'continuous'
    })
  }
}
IonRangeSlider.initClass()
