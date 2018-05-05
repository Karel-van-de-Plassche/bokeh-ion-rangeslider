//jQuery(input).ionRangeSlider(opts)
//import $ = require('jquery')
//import "ion-rangeslider"

import {throttle} from "core/util/callback"
import {Color} from "core/types"
// The "core/properties" module has all the property types
import * as p from "core/properties"
import {div, input} from "core/dom"
import {logger} from "core/logging"
import {Orientation, SliderCallbackPolicy} from "core/enums"
import {repeat} from "core/util/array"

// We will subclass in JavaScript from the same class that was subclassed
// from in Python
import {Widget, WidgetView} from "models/widgets/widget"
import {AbstractSlider, AbstractSliderView, SliderSpec} from "models/widgets/abstract_slider"


export class IonRangeSliderView extends AbstractSliderView {
  model: IonRangeSlider

  protected sliderEl: null
  protected titleEl: HTMLElement
  protected valueEl: HTMLElement
  protected callback_wrapper?: () => void

  protected _calc_to(): SliderSpec {
    return {
      start: this.model.start,
      end: this.model.end,
      value: [this.model.value],
      step: this.model.step,
    }
  }

  protected _calc_from(values: number[]): number[] {
    return values
  }

  initialize(options: any): void {
    super.initialize(options)
    logger.info('Initialize function called, rendering..')
    this.render()
  }

  render(): void {
    logger.info(`[ionRangeSlider] Start rendering`)
    logger.info(this.model)
    if (this.model.format) {
      logger.warn('[ionRangeSlider] Option format currently ignored')
    }
    if (this.sliderEl == null) {
      logger.info(`[ionRangeSlider] am I here?`)
      // XXX: temporary workaround for _render_css()
      this._render_classes() // XXX: because no super()

      // LayoutDOMView sets up lots of helpful things, but
      // it's render method is not suitable for widgets - who
      // should provide their own.
      if (this.model.height != null)
        this.el.style.height = `${this.model.height}px`
      if (this.model.width != null)
        this.el.style.width = `${this.model.width}px`
    }

    logger.info(`[ionRangeSlider] Setting callback`)
    if (this.model.callback != null) {
      const callback = () => this.model.callback.execute(this.model)

      switch (this.model.callback_policy) {
        case 'continuous': {
          this.callback_wrapper = callback
          break
        }
        case 'throttle': {
          this.callback_wrapper = throttle(callback, this.model.callback_throttle)
          break
        }
      }
    }
    //
    // Set up parameters
    const prefix = 'bk-ionRange-'

    const {start, end, value, step} = this._calc_to()

    //logger.info(`[ionRangeSlider] Setting tooltips`)
    //let tooltips: boolean | any[] // XXX
    //if (this.model.tooltips) {
    //  const formatter = {
    //    to: (value: number): string => this.model.pretty(value),
    //  }

    //  tooltips = repeat(formatter, value.length)
    //} else
    //  tooltips = false

    this.el.classList.add("bk-slider")
    console.log(this.sliderEl)
    console.log(this.model.values)
    console.log(this.model.values instanceof Array)
    if (this.sliderEl == null) {
      //this.sliderEl = input({type: "text", class: "slider", id: this.model.id})
      this.sliderEl = input({type: "text", class: "slider", id: 'blerger'})
      this.el.appendChild(this.sliderEl) // XXX: bad typings; no cssPrefix


      console.log('[ionRangeSlider] initializing external class')
      var opts: IonRangeSliderOptions = {
        type: this.model.slider_type,
        cssPrefix: prefix,
        disable: false
      }
      if (this.model.values instanceof Array) {
        opts.values = this.model.values
      } else {
        opts.min = start
        opts.max = end
        opts.start = value
        opts.step = step
      }
      opts.grid = this.model.grid
      opts.prettify_enabled = this.model.prettify_enabled
      opts.prettify = this.model.prettify
      opts.force_edges = this.model.force_edges
      opts.prefix = this.model.prefix
      opts.disable = this.model.disable

      $(this.sliderEl).ionRangeSlider(opts);

      console.log('[ionRangeSlider] Setting color')
      $(this.el).find('.irs-bar').css('background', this.model.bar_color)
      $(this.el).find('.irs-bar-edge').css('background', this.model.bar_color)
      $(this.el).find('.irs-single').css('background', this.model.bar_color)

    }
  }
}

      //    opts = {
      //      onChange: this.slide,
      //      onFinish: this.slidestop,
      //    }
      //
      //    this.model.range = range
      //    this.$el.find( "////{ this.model.id }" ).val( range.join(' - '))
      //    this.$el.find('.bk-slider-parent').height(this.model.height)
      //
      //
      //  slidestop: (data) =>
      //    if this.model.callback_policy == 'mouseup' or this.model.callback_policy == 'throttle'
      //      this.model.callback?.execute(this.model)
      //
      //  slide: (data) =>
      //    range = [data.from, data.to]
      //    value = range.join(' - ')
      //    this.$el.find( "////{ this.model.id }" ).val( value )
      //    this.model.range = range
      //    if this.callbackWrapper then this.callbackWrapper()
      //
      //  prettify: (data) =>
      //    this.model.prettify?.execute(data)

export namespace IonRangeSlider {
  export interface Attrs extends Widget.Attrs {
    slider_type:       string
    values:            any
    grid:              boolean
    prettify_enabled:  boolean
    prettify:          any
    force_edges:       boolean
    prefix:            string
    disable:           boolean
  }

  export interface Props extends Widget.Props {}
}

export interface IonRangeSlider extends IonRangeSlider.Attrs {}

export class IonRangeSlider extends AbstractSlider {

  properties: IonRangeSlider.Props

  constructor(attrs?: Partial<IonRangeSlider.Attrs>) {
    super(attrs)
  }

  static initClass(): void {
    this.prototype.type = "IonRangeSlider"
    this.prototype.default_view = IonRangeSliderView

    this.define({
      slider_type:       [ p.String,      "single"     ],
      values:            [ p.Any,                      ],
      grid:              [ p.Bool,        true         ],
      prettify_enabled:  [ p.Bool,        true         ],
      prettify:          [ p.Any,         null         ],
      force_edges:       [ p.Bool,        false        ],
      prefix:            [ p.String,      ""           ],
      disable:           [ p.Bool,        false        ],
    })
  }
  start = 0
  end   = 1
  value = [0, 1]
  step = 0.1
  bar_color = null

  protected _formatter(value: number, _format: string): string {
    return `${value}`
  }

  pretty(value: number): string {
    return this._formatter(value, this.format)
  }
}

IonRangeSlider.initClass()
