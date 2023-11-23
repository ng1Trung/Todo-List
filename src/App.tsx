import { FormEvent, useEffect, useRef, useState } from 'react'
import TodoItem from './TodoItem'
import { Item } from './models'

function App() {
    const inputRef = useRef<any>('')

    const [todoName, setTodoName] = useState<string>('')
    const [list, setList] = useState<Item[]>([])
    const [clickedItemList, setClickedItemList] = useState<number[]>([])

    useEffect(() => {
        if (list?.length) {
            localStorage.setItem('todo-list', JSON.stringify(list))
        }
    }, [list])

    useEffect(() => {
        if (localStorage.getItem('todo-list')) {
            const localList = localStorage.getItem('todo-list') as string

            setList(JSON.parse(localList))
        }
    }, [localStorage.getItem('todo-list')])

    const todoNameHandler = (e: any) => {
        setTodoName(e.target.value)
    }

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (todoName?.length) {
            setList((props: Item[]) => {
                return [
                    {
                        id: props?.length + 1,
                        name: todoName,
                        status: 1,
                    },
                    ...props,
                ]
            })
        }

        inputRef.current.value = ''
        inputRef.current.focus()

        setTodoName('')
        setClickedItemList([])
    }

    const deleteHandler = () => {
        if (!!clickedItemList?.length) {
            const arr = list.filter((item: Item) => !clickedItemList.includes(item?.id as number))

            setList(arr)
            setClickedItemList([])
        }
    }

    const clickedItemHandler = (itemId: number) => {
        if (clickedItemList.findIndex((clickedItemId: number) => clickedItemId === itemId) === -1) {
            setClickedItemList((props: number[]) => {
                return [...props, itemId]
            })
        } else {
            const arr = clickedItemList.filter((clickedItemId: number) => clickedItemId !== itemId)

            setClickedItemList(arr)
        }
    }

    const statusChangeHandler = (item: Item) => {
        const cloneList = list.map((td: Item) => {
            if (td.id === item.id) {
                return { ...td, status: item.status }
            }

            return td
        })

        setList(cloneList)
    }

    return (
        <div className="App">
            <h1 className="title">TODO LIST</h1>

            {/* form */}
            <form className="form" onSubmit={submitHandler}>
                <input ref={inputRef} type="text" className="form-input" onChange={todoNameHandler} />
                <button type="submit" className="form-button">
                    Save
                </button>
            </form>

            {/* options */}
            <div className="options">
                <button className={`options-button ${clickedItemList?.length <= 0 ? 'disabled' : ''}`} onClick={deleteHandler}>
                    Delete
                </button>

                {!!clickedItemList?.length && <p>{`${clickedItemList.length} selected`}</p>}
            </div>

            {/* list */}
            <div className="list">
                {!!list?.length &&
                    list?.map((item: Item) => {
                        return <TodoItem key={item?.id} item={item} onClick={clickedItemHandler} onStatusChange={statusChangeHandler} />
                    })}
            </div>
        </div>
    )
}

export default App
