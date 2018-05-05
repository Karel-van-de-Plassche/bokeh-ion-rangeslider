//import * as Bokeh from './bokeh-0.12.5.min.js'
//var plt = Bokeh.Plotting
//// arrays to hold data
//var source = new Bokeh.ColumnDataSource({
//    data: { x: [], y: [] }
//});
//
//// make the plot and add some tools
//var tools = "pan,crosshair,wheel_zoom,box_zoom,reset,save";
//
//var plot = Bokeh.Plotting.figure({title:'Example of Random data', tools: tools, height: 300, width: 300});
//
//var scatterData = plot.line({ field: "x" }, { field: "y" }, {
//    source: source,
//    line_width: 2
//});
//
//// Show the plot, appending it to the end of the current
//// section of the document we are in.
//
//function addPoint() {
//    // The data can be added, but generally all fields must be the
//    // same length.
//    source.data.x.push(Math.random());
//    source.data.y.push(Math.random());
//    // Also, the DataSource object must be notified when it has changed.
//    source.change.emit();
//}
//addPoint();
//Bokeh.Plotting.show(plot);

namespace Categorical {
  declare var Bokeh: any
  var plt = Bokeh.Plotting
  const {Row} = Bokeh

  console.log(`Bokeh ${Bokeh.version}`)
  Bokeh.set_log_level("info")
  //Bokeh.settings.dev = true

  const dot = () => {
    const factors = ["a", "b", "c", "d", "e", "f", "g", "h"]
    const x =  [50, 40, 65, 10, 25, 37, 80, 60]

    //const fig = plt.figure({title: "Categorical Dot Plot", tools: "", toolbar_location: null, y_range: factors, x_range: [0, 100]})
    const fig = plt.figure({y_range: factors, x_range: [0, 100]})

    fig.segment(0, factors, x, factors, {line_width: 2, line_color: "green"})
    fig.circle(x, factors, {size: 15, fill_color: "orange", line_color: "green", line_width: 3})
    return fig
  }

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

  plt.show(new Row({children: [hm(), dot()], sizing_mode: "scale_width"}))
}
