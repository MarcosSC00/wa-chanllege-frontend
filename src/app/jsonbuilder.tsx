'use client'
import { useState } from "react"

interface Node {
    name: string,
    children: Node[]
}
export function JsonBuilder() {
    const [hierarchy, setHierarchy] = useState<Node>()
    const [targetNode, setTargetNode] = useState<string>('');
    const [newNodeName, setNewNodeName] = useState<string>('');

    const addRootNode = (value: string) => {
        if (value) {
            const initializer = { name: value, children: [] }
            setHierarchy(initializer)
            setNewNodeName('')
        } else {
            return
        }
    }

    const isNodeAddable = (hierarchy: Node, targetNode: string, newNode: Node): boolean => {
        if (hierarchy.name.toLowerCase() === targetNode.toLowerCase()) {
            if (hierarchy.children) {
                hierarchy.children.push(newNode)
            } else {
                hierarchy.children = [{ name: targetNode, children: [] }]
            }
            return true
        }
        for (const child of hierarchy.children) {
            const add = isNodeAddable(child, targetNode, newNode)
            if (add) return true
        }
        return false
    }

    const handleAddNode = (e: React.FormEvent) => {
        e.preventDefault()

        if (hierarchy) {
            if (nodeExist(hierarchy, newNodeName)) {
                alert("valor ja inserido!")
                return
            }
        }

        const newNode = { name: newNodeName, children: [] }
        const newHierachy = { ...hierarchy } as Node

        const add = isNodeAddable(newHierachy, targetNode, newNode)

        if (add) {
            setHierarchy(newHierachy)
            setTargetNode('')
            setNewNodeName('')
        } else {
            alert("Nó não encontrado ou já existente.")
        }
    }

    const nodeExist = (hierarchy: Node, name: string): boolean => {
        if (hierarchy.name.toLowerCase() === name.toLowerCase()) {
            return true
        }

        for (const child of hierarchy.children) {
            if (nodeExist(child, name)) {
                return true
            }
        }
        return false
    }

    const salveJson = () => {
        const json = JSON.stringify(hierarchy, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = "hierarchy.json"
        link.click()
    }

    return (
        <div className="w-full mt-[100px] md:mt-0 h-full flex flex-col md:flex-row items-center gap-5 justify-center md:justify-between px-2 md:px-5">
            {hierarchy ? (
                <div className="w-full md:w-[50%] flex flex-col items-center justify-center">
                    <form onSubmit={handleAddNode} className="w-full md:max-w-[450px]">
                        <div className="flex flex-col items-center">
                            <label className=" w-full text-gray-200 font-semibold text-md">
                                Nome do nó de destino:
                                <input
                                    type="text"
                                    value={targetNode}
                                    onChange={(e) => setTargetNode(e.target.value)}
                                    required
                                    className="w-full mt-2 outline-none bg-gray-600 px-3 py-2 text-gray-200 rounded-md"
                                />
                            </label>
                        </div>
                        <div className="flex flex-col items-center mt-3">
                            <label className="w-full text-gray-200 font-semibold text-md">
                                Nome do novo nó:
                                <input
                                    type="text"
                                    value={newNodeName}
                                    onChange={(e) => setNewNodeName(e.target.value)}
                                    required
                                    className="w-full mt-2 outline-none bg-gray-600 px-3 py-2 text-gray-200 rounded-md"
                                />
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="px-2 py-1 mt-3 text-md font-semibold bg-blue-900 rounded-md transition-colors duration-150 hover:bg-blue-950"
                        >
                            ADICIONAR
                        </button>
                    </form>
                </div>
            ) : (
                <div className="w-full md:w-[50%] flex flex-col items-center justify-center">
                    <form >
                        <label className="w-full text-gray-200 font-semibold text-md">
                            Nó raiz:
                            <input
                                type="text"
                                onChange={(e) => setNewNodeName(e.target.value)}
                                required
                                className="w-full mt-2 outline-none bg-gray-600 px-3 py-2 text-gray-200 rounded-md"
                            />
                        </label>

                        <button
                            type="button"
                            onClick={() => addRootNode(newNodeName)}
                            className="px-2 py-1 mt-3 text-md font-semibold bg-blue-900 rounded-md transition-colors duration-150 hover:bg-blue-950"
                        >
                            CRIAR HIEARARQUIA
                        </button>
                    </form>
                </div>
            )}

            <div className="w-full md:w-[50%] py-4 flex flex-col items-center">
                <div className=" mt-0 w-full md:mt-[75px] h-[250px] md:h-[450px] overflow-auto flex flex-col items-center justify-start bg-slate-800 rounded-md">
                    <h2 className="text-2xl font-semibold my-5">Hierarquia de Nós</h2>
                    <pre>{JSON.stringify(hierarchy, null, 2)}</pre>
                </div>

                <button
                    type="button"
                    onClick={() => salveJson()}
                    className="py-1 px-3 mt-3 text-md font-semibold bg-green-600 rounded-md transition-colors duration-150 hover:bg-green-700"
                >
                    DOWNLOAD
                </button>
            </div>

        </div>

    )
}