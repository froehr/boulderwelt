# Boulderwelt iOS Widget based on Scriptable

![Sample image not found][logo]

[logo]: https://raw.githubusercontent.com/froehr/boulderwelt/main/docu/widget-sample.jpeg "Widget Sample"


## Features

1. Show if your Boulderwelt is open right now.
1. Show how high the current utilization is.
1. Show how many people are currently waiting.
1. Show a bar-graph of today's utilization since the BW opened. Including color coding of how full
   it was.
1. Show a line chart from the same day last week as a comparison to get a feeling how full it will
   be today.
1. All values are updated every 10 minutes in the backend. But your iPhone determines how often the
   widget is refreshed.

## Supported Boulderwelten

| Boulderwelt  | Short-Name | Supported |
| :----------: |:----------:| :--------:|
| München Ost  | muc-ost    | ✅        |
| München West | muc-west   | ✅        |
| München Süd  | muc-sued   | ✅        |
| Regensburg   | reg        | ✅        |
| Dortmund     | dor        | ✅        |
| Frankfurt    | fra        | ❌        |

## How to use it

### Preparation

The preparation step only needs to be done once. Afterwards the widget can be used multiple times.

1. Install the Scriptable app on your iPhone via the App Store. Link to Scriptable
   app: https://apps.apple.com/de/app/scriptable/id1405459188

1. Take your iPhone and go to:

   https://raw.githubusercontent.com/froehr/boulderwelt/main/widget/widget.js

   This is the code for the widget to run on your phone.
   **Copy EVERYTHING from the first till the last line.**

1. Open the Scriptable app on your iPhone and tap the **+** Button in the top right corner to create
   a new script.

1. Paste the **COMPLETE** code from the link in step 2 into the editor and click done in the top
   left corner.

1. The new script should be available in the overview now and named _Untitled Script_. By blicking
   it a preview of the widget should be shown.

1. Rename the new script by long-clicking it and choosing _rename_. Name the script _Boulderwelt_.

### Adding the widget to the iOS homescreen

After the preparation step the widget can be put onto the homescreen multiple times for the
Boulderwelten of your choice.

1. Go back to your iPhone's homescreen to place the new widget on it.

1. Long press the homescreen (not an app) until the little **+** appears in the top left corner and
   all apps are wobbling around.

1. Tap the plus and chose **Scriptable** from the list. It should be somewhere close to the end of
   the list.

1. Choose the smallest of the widget sizes and click **Add Widget**.

1. An empty widget has been placed on your homescreen now.

1. While it is still wobbling tap it and choose the script that should be executed. Choose the
   script _Boulderwelt_ that you've just created in the preparation phase.

1. By default **Boulderwelt München Ost** is enabled. If you are interested in another Boulderwelt
   type the short-name of your Boulderwelt into the field parameter. The short-name can be found in
   the table under **Supported Boulderwelten**.

1. Click Ready. Your Boulderwelt Widget should be ready to use now.


    
