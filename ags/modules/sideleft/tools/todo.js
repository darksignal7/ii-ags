const { Gtk } = imports.gi;
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
const { execAsync, exec } = Utils;
const { Box, Button, EventBox, Icon, Label, Scrollable, Stack, Revealer } = Widget;
import SidebarModule from './module.js';
import { MaterialIcon } from '../../.commonwidgets/materialicon.js';
import { setupCursorHover } from '../../.widgetutils/cursorhover.js';
import { TabContainer } from '../../.commonwidgets/tabcontainer.js';

import Todo from "../../../services/todo.js";

import { distroID, isArchDistro, isDebianDistro, hasFlatpak } from '../../.miscutils/system.js';

const OPACITY = 0.05;

export default () => SidebarModule({
    icon: MaterialIcon('done_outline', 'norm'),
    name: getString('To-Do'), 
    child: TodoWidget(),  
})


const TodoListItem = (task, id, isDone, isEven = false, tag = '') => {
    var fullText = task.content;
    const wordsOfText = fullText.split(' ');
    const fixedText = wordsOfText.slice(1).join(' ');
    const taskName = Widget.Box({
        vertical: true,
        children :[
            Widget.Label({
                //hexpand: true,
                xalign: 0,
                wrap: true,
                className: 'txt txt-small sidebar-todo-txt',
                label: fixedText,
                selectable: true,
            }),
            Widget.Label({
                hexpand: true,
                xalign: 0,
                wrap: true,
                className: 'txt txt-subtext sidebar-todo-txt',
                label: tag,
                //selectable: true,
            }),
        ]
    })
    const actions = Box({
        hpack: 'end',
        className: 'spacing-h-5 sidebar-todo-actions',
        children: [
            Widget.Button({ // Check/Uncheck
                vpack: 'center',
                className: 'txt sidebar-todo-item-action',
                child: MaterialIcon(`${isDone ? 'remove_done' : 'check'}`, 'norm', { vpack: 'center' }),
                onClicked: (self) => {
                    const contentWidth = todoContent.get_allocated_width();
                    crosser.toggleClassName('sidebar-todo-crosser-crossed', true);
                    crosser.css = `margin-left: -${contentWidth}px;`;
                    Utils.timeout(200, () => {
                        widgetRevealer.revealChild = false;
                    })
                    Utils.timeout(350, () => {
                        if (isDone)
                            Todo.uncheck(id);
                        else
                            Todo.check(id);
                    })
                },
                setup: setupCursorHover,
            }),
            Widget.Button({ // Remove
                vpack: 'center',
                className: 'txt sidebar-todo-item-action',
                child: MaterialIcon('delete_forever', 'norm', { vpack: 'center' }),
                onClicked: () => {
                    const contentWidth = todoContent.get_allocated_width();
                    crosser.toggleClassName('sidebar-todo-crosser-removed', true);
                    crosser.css = `margin-left: -${contentWidth}px;`;
                    Utils.timeout(200, () => {
                        widgetRevealer.revealChild = false;
                    })
                    Utils.timeout(350, () => {
                        Todo.remove(id);
                    })
                },
                setup: setupCursorHover,
            }),
        ]
    })
    const crosser = Widget.Box({
        className: 'sidebar-todo-crosser',
    });
    const todoContent = Widget.Box({
        // BURAYA GEL BABA
        //css: 'background: rgba(255, 255, 255, 0.2);',
        className: 'sidebar-todo-item spacing-h-5',
        children: [
            Widget.Box({
                vertical: true,
                children: [
                    taskName,
                    actions,
                ]
            }),
            crosser,
        ]
    });
    if (tag === 'important'){
        todoContent.css = 'background : linear-gradient(250deg,rgba(255, 0, 0,' + OPACITY + ') 0%, rgba(0, 0, 0, 0) 100%);;';
    }else if (tag === 'godot'){
        todoContent.css = 'background : linear-gradient(250deg,rgba(0, 0, 255,' + OPACITY + ') 0%, rgba(0, 0, 0, 0) 100%);';
    }else if (tag === 'ags'){
        todoContent.css = 'background : linear-gradient(250deg,rgba(255, 255, 255,' + OPACITY + ') 0%, rgba(0, 0, 0, 0) 100%);';
    }
    const widgetRevealer = Widget.Revealer({
        revealChild: true,
        transition: 'slide_down',
        transitionDuration: userOptions.animations.durationLarge,
        child: todoContent,
    })
    return Box({
        homogeneous: true,
        
        children: [widgetRevealer]
    });
}

const todoItems = (isDone) => Widget.Scrollable({
    hscroll: 'never',
    vscroll: 'automatic',
    css: 'min-height: 350px;',
    child: Widget.Box({
        vertical: true,
        className: 'spacing-v-5',
        setup: (self) => self
            .hook(Todo, (self) => {
                self.children = Todo.todo_json.map((task, i, tag) => {
                    if (task.done != isDone) return null;
                    return TodoListItem(task, i, isDone, false, task.tag);
                })
                if (self.children.length == 0) {
                    self.homogeneous = true;
                    self.children = [
                        Widget.Box({
                            hexpand: true,
                            vertical: true,
                            vpack: 'center',
                            className: 'txt txt-subtext',
                            children: [
                                MaterialIcon(`${isDone ? 'checklist' : 'check_circle'}`, 'gigantic'),
                                Label({ label: `${isDone ? getString('Finished tasks will go here') : getString('Nothing here!')}` })
                            ]
                        })
                    ]
                }
                else self.homogeneous = false;
            }, 'updated')
        ,
    }),
    setup: (listContents) => {
        const vScrollbar = listContents.get_vscrollbar();
        vScrollbar.get_style_context().add_class('sidebar-scrollbar');
    }
});

const UndoneTodoList = () => {
    
    const newTaskButton = Revealer({
        transition: 'slide_left',
        transitionDuration: userOptions.animations.durationLarge,
        revealChild: true,
        child: Button({
            className: 'txt-small sidebar-todo-new',
            halign: 'end',
            vpack: 'center',
            label: getString('+ New task'),
            setup: setupCursorHover,
            onClicked: (self) => {
                newTaskButton.revealChild = false;
                newTaskEntryRevealer.revealChild = true;
                confirmAddTask.revealChild = true;
                cancelAddTask.revealChild = true;
                newTaskEntry.grab_focus();
            }
        })
    });
    const cancelAddTask = Revealer({
        transition: 'slide_right',
        transitionDuration: userOptions.animations.durationLarge,
        revealChild: false,
        child: Button({
            className: 'txt-norm icon-material sidebar-todo-add',
            halign: 'end',
            vpack: 'center',
            label: 'close',
            setup: setupCursorHover,
            onClicked: (self) => {
                newTaskEntryRevealer.revealChild = false;
                confirmAddTask.revealChild = false;
                cancelAddTask.revealChild = false;
                newTaskButton.revealChild = true;
                newTaskEntry.text = '';
            }
        })
    });
    const newTaskEntry = Widget.Entry({
        // hexpand: true,
        vpack: 'center',
        className: 'txt-small sidebar-todo-entry',
        placeholderText: getString('Add a task...'),
        onAccept: ({ text }) => {
            if (text == '') return;
            Todo.add(text)
            newTaskEntry.text = '';
        },
        onChange: ({ text }) => confirmAddTask.child.toggleClassName('sidebar-todo-add-available', text != ''),
    });
    const newTaskEntryRevealer = Revealer({
        transition: 'slide_right',
        transitionDuration: userOptions.animations.durationLarge,
        revealChild: false,
        child: newTaskEntry,
    });
    const confirmAddTask = Revealer({
        transition: 'slide_right',
        transitionDuration: userOptions.animations.durationLarge,
        revealChild: false,
        child: Button({
            className: 'txt-norm icon-material sidebar-todo-add',
            halign: 'end',
            vpack: 'center',
            label: 'arrow_upward',
            setup: setupCursorHover,
            onClicked: (self) => {
                if (newTaskEntry.text == '') return;
                Todo.add(newTaskEntry.text);
                newTaskEntry.text = '';
            }
        })
    });
    return Box({ // The list, with a New button
        vertical: true,
        className: 'spacing-v-10',
        setup: (box) => {
            box.pack_start(todoItems(false), true, true, 0);
            box.pack_start(Box({
                setup: (self) => {
                    self.pack_start(cancelAddTask, false, false, 0);
                    self.pack_start(newTaskEntryRevealer, true, true, 0);
                    self.pack_start(confirmAddTask, false, false, 0);
                    self.pack_start(newTaskButton, false, false, 0);
                }
            }), false, false, 0);
        },
    });
}

export const TodoBar = () => Widget.Box({
    children: [
        TodoWidget(),
    ]
})

export const TodoWidget = () => TabContainer({
    icons: ['format_list_bulleted', 'task_alt'],
    names: [getString('Unfinished'), getString('Done')],
    className: 'spacing-h-5',
    children: [
        UndoneTodoList(),
        todoItems(true),
    ]
})

