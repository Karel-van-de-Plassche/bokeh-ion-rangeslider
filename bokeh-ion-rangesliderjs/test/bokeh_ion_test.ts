//declare var Bokeh: any
import * as Bokeh from 'bokehjs'
var plt = Bokeh.Plotting
const {Row} = Bokeh

console.log(`Bokeh ${Bokeh.version}`)
Bokeh.set_log_level("info")
//Bokeh.settings.dev = true

const hm = () => {
  const factors = ["foo", "bar", "baz"]
  const x = ["foo", "foo", "foo", "bar", "bar", "bar", "baz", "baz", "baz"]
  const y = ["foo", "bar", "baz", "foo", "bar", "baz", "foo", "bar", "baz"]
  const colors = [
    "#0B486B", "#79BD9A", "#CFF09E",
    "#79BD9A", "#0B486B", "#79BD9A",
    "#CFF09E", "#79BD9A", "#0B486B",
  ]

  const fig = plt.figure({title: "Categorical Heatmap", tools: "hover", toolbar_location: null, x_range: factors, y_range: factors})

  fig.rect(x, y, 1, 1, {color: colors})
  return fig
}

plt.show(new Row({children: [hm()], sizing_mode: "scale_width"}))
