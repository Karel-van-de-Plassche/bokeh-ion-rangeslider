from __future__ import print_function

#from datetime import date
import os
import sys
sys.path.append('..')

from IPython import embed

from bokeh.io import show, save, curdoc
from bokeh.document import Document
from bokeh.embed import file_html
from bokeh.resources import INLINE
from bokeh.util.browser import view
from bokeh.models import ColumnDataSource
from bokeh.models.layouts import Row, Column, WidgetBox
from bokeh.models.widgets import Div
from bokeh.models.callbacks import CustomJS
from bokeh.plotting import figure
from bokeh_ion_rangeslider import *

default_slider = IonRangeSlider()
slider = IonRangeSlider(title="Numerical", value=[50, 10000], start=0, end=96, step=5, show_value=True)

disabled_slider = IonRangeSlider(title="Disabled", value=[50, 50], start=0, end=96, step=5, disabled=True, show_value=True)

range_slider = IonRangeSlider(slider_type='double', title="Numerical range", value=[30, 70], start=0, end=100, step=0.5, show_value=True)

only_value_slider = IonRangeSlider(value=[50, 50], start=0, end=96, step=5)

no_title_slider = IonRangeSlider(title=None, value=[50, 50], start=0, end=96, step=5)

round = CustomJS(code="""
         var f = cb_obj
         f = Number(f.toPrecision(2))
         return f
     """)

prettified_slider = IonRangeSlider(title=None, values=[1, 2, 3.141592, 1000000], start=0, end=96, step=5, prettify=round)
string_slider = IonRangeSlider(title=None, values=['apple', 'banana', 'cherry', 'kiwi'], value=('banana', 'banana'), prettify=round)

def color_slider(title, color):
    return IonRangeSlider(title=title, show_value=False, height=300, value=[127, 127], start=0, end=255, step=1, orientation="vertical", bar_color=color, grid=False, width=50)
def color_picker():

    red   = color_slider("R", "red")
    green = color_slider("G", "green")
    blue  = color_slider("B", "blue")
    hex_color = '#888888'
    source = ColumnDataSource(data=dict(color=[hex_color]))

    p1 = figure(x_range=(-8, 8), y_range=(-4, 4),
            plot_width=100, plot_height=100,
            title='move sliders to change', tools='', toolbar_location=None)
    p1.axis.visible = False
    p1.rect(0, 0, width=18, height=10, fill_color='color',
        line_color = 'black', source=source)

    cb = CustomJS(args=dict(source=source, red=red, green=green, blue=blue), code="""
        function componentToHex(c) {
            var hex = c.toString(16)
            return hex.length == 1 ? "0" + hex : hex
        }
        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
        }
        function toInt(v) {
           return v | 0
        }
        const color = source.data['color']
        const R = toInt(red.value[0])
        const G = toInt(green.value[0])
        const B = toInt(blue.value[0])
        color[0] = rgbToHex(R, G, B)
        source.change.emit()
    """)

    red.js_on_change('value_throttled', cb)
    green.js_on_change('value_throttled', cb)
    blue.js_on_change('value_throttled', cb)

    return Row(children=[
        red,
        green,
        blue,
        p1,
    ])

def color_picker_python():

    red   = color_slider("R", "red")
    green = color_slider("G", "green")
    blue  = color_slider("B", "blue")

    hex_color = '#888888'
    source = ColumnDataSource(data=dict(color=[hex_color]))

    p2 = figure(x_range=(-8, 8), y_range=(-4, 4),
            plot_width=100, plot_height=100,
            title='Bokeh serve only', tools='', toolbar_location=None)
    p2.axis.visible = False
    r1 = p2.rect(0, 0, width=18, height=10, fill_color='color',
        line_color = 'black', source=source)

    def rgb_to_hex(rgb):
        return '#%02x%02x%02x' % rgb

    def callback(attr, old, new):
        source.data['color'] = [rgb_to_hex((red.value[0], green.value[0], blue.value[0]))]
        return

    red.on_change('value', callback)
    green.on_change('value', callback)
    blue.on_change('value', callback)

    return Row(children=[
        red,
        blue,
        green,
        p2,
    ],
               width=400
               )
test_slider = IonRangeSlider(slider_type='double', start=0, end=77, values=[1,2,3.123123,40.1234], prettify=round)

sliders = Row(children=[
    Column(children=[
        default_slider,
        slider,
        disabled_slider,
        range_slider,
        only_value_slider,
        no_title_slider,
        prettified_slider,
        string_slider
    ]),
   Column(children=[
        color_picker(),
        color_picker_python(),
    ])
])

doc = curdoc()
doc.add_root(sliders)
save(doc)

#if __name__ == "__main__":
#    doc.validate()
#    filename = "ion_range_sliders.html"
#    with open(filename, "w") as f:
#        f.write(file_html(doc, INLINE, "ion_range_sliders"))
#    print("Wrote %s" % filename)
#    view(filename)
