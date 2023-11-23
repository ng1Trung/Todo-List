import { MouseEvent, forwardRef, useEffect, useState } from 'react'
import { Item } from './models'
import Tippy from '@tippyjs/react/headless'
import 'tippy.js/dist/tippy.css'

export interface TippyStatus {
    id: number
    name: string
}

export interface TodoItemProps {
    item: Item
    onClick?: (arg: number) => void
    onStatusChange?: (arg: Item) => void
}

const statusList: TippyStatus[] = [
    { id: 0, name: 'processing' },
    { id: 1, name: 'todo' },
    { id: 2, name: 'done' },
]

const TodoItem = forwardRef(({ item, onClick = () => {}, onStatusChange = () => {} }: TodoItemProps, ref) => {
    const [active, setActive] = useState(false)
    const [visible, setVisible] = useState(false)
    const [statusColor, setStatusColor] = useState('')

    useEffect(() => {
        switch (item?.status) {
            case 0:
                setStatusColor('processing')
                break

            case 1:
                setStatusColor('todo')
                break
            case 2:
                setStatusColor('done')
                break
            default:
                setStatusColor('')
        }
    }, [item?.status])

    const onClickHandler = () => {
        if (item?.id) {
            onClick(item.id)
        }

        setActive(!active)
    }

    const showTippyHandler = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation()

        setVisible(!visible)
    }

    const statusChangeHandler = (e: MouseEvent<HTMLElement>, statusId: number) => {
        e.stopPropagation()

        onStatusChange({ ...item, status: statusId })

        setVisible(false)
    }

    return (
        <div className={`item ${active ? 'active' : ''} ${statusColor}`} onClick={onClickHandler}>
            <div className="item-name">{item?.name}</div>

            <Tippy
                visible={visible}
                delay={[0, 800]}
                interactive={true}
                placement="bottom-end"
                render={(attrs) => (
                    <div className="tippy-wrapper" tabIndex={-1} {...attrs} onClick={(e) => e.stopPropagation()}>
                        {statusList?.map((status: TippyStatus) => {
                            return (
                                <div key={status?.id} className="tippy-item" onClick={(e) => statusChangeHandler(e, status?.id)}>
                                    <span className="tippy-item__name">{status?.name}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            >
                <div className="item-status" onClick={showTippyHandler}>
                    {statusList.map((status: TippyStatus) => {
                        return status?.id === item?.status ? status?.name : ''
                    })}
                </div>
            </Tippy>
        </div>
    )
})

export default TodoItem
