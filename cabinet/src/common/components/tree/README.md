# Дерево. Поиск, выбор.

## Атрибуты для инициализации

**data-url** - url, который возвращает JSON с данными.

**data-input-selector** - id input, куда пишутся результаты выбора.

**data-show-selected="true"** - показывать выбранные значения рядом с кнопкой

**data-show-number-selected="true"** - показывает колличество выбранных значений рядом с кнопкой

**data-unique="true"** - дает выбрать только один элемет в дереве

## Store 

**Store** - объект, который включает в себя state и функции, которые
вносят изменения в state. 

Подробнее можно ознакомиться тут https://ru.vuejs.org/v2/guide/state-management.html

## Инициализация

Во время инициализации, компонент Tree в хуке жизненного цикла mounted, делает запрос
на сервер(data-url), получает дерево.
 
### Формат дерева:
`{

     "roots": [
         {
             "id": "1-0-0",
             "name": "Rastuto",
             "inners": [
                 {
                     "id": "1-1-0",
                     "name": "Liteqflexic",
                     "inners": [
                         {
                             "id": "1-1-1",
                             "name": "Yeatthcath",
                             "inners": null
                         },
                         ...
                     ]
                 },
                 {
                     "id": "1-2-0",
                     "name": "Teleno",
                     "inners": [
                         {
                             "id": "1-2-1",
                             "name": "Nemomund",
                             "inners": null
                         },
                         ...
                     ]
                 },
                 ...
             ]
         }
     ]
}`
 
Затем к каждому узлу(node) добавляются 
свойства-флаги с дефолтными значениями:
- **found** = false - показывает, соответствует ли узел или его дети строке поиска (q)
- **open** = false - открыт/закрыт узел
- **checked** = false - выбран/не выбран узел
- **childchecked** = false - выбраны/не выбраны дети

Если в инпуте(data-input-selector) в value есть список с id, то проставляем у соответствующих узлов checked = true (функция setCheckedOutInput).

### В итоге получается объект такого формата:

    `{
        checked:false
        childchecked:true
        found:true
        id:"1-0-0-0"
        inners:Array[10] // массив с объектами
        name:"Aproune"
        open:false
    }
    `

## Поиск

При изменении строки поиска (store.state.q), функция search обходит все узлы, сравнивает свойство name cо строкой и изменяет флаг found.

## Перерисовка

Перерисовка дерева происходит при любом изменении объекта **state**