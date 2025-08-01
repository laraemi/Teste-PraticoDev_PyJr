import { useState, useEffect } from 'react'
import { categoryService } from '../services/categoryService'
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3B82F6'
    })

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            setLoading(true)
            const response = await categoryService.getCategories()
            setCategories(response.results || response || [])
        } catch (error) {
            toast.error('Erro ao carregar categorias')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData)
                toast.success('Categoria atualizada com sucesso!')
            } else {
                await categoryService.createCategory(formData)
                toast.success('Categoria criada com sucesso!')
            }
            setShowModal(false)
            resetForm()
            loadCategories()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao salvar categoria')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
            try {
                await categoryService.deleteCategory(id)
                toast.success('Categoria excluída com sucesso!')
                loadCategories()
            } catch (error) {
                toast.error('Erro ao excluir categoria')
            }
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            color: '#3B82F6'
        })
        setEditingCategory(null)
    }

    const openEditModal = (category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            description: category.description || '',
            color: category.color
        })
        setShowModal(true)
    }

    const colorOptions = [
        { value: '#3B82F6', label: 'Azul' },
        { value: '#EF4444', label: 'Vermelho' },
        { value: '#10B981', label: 'Verde' },
        { value: '#F59E0B', label: 'Amarelo' },
        { value: '#8B5CF6', label: 'Roxo' },
        { value: '#F97316', label: 'Laranja' },
        { value: '#EC4899', label: 'Rosa' },
        { value: '#6B7280', label: 'Cinza' }
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
                    <p className="text-gray-600">Organize suas tarefas por categorias</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Categoria
                </button>
            </div>

            {/* Lista de Categorias */}
            <div className="card">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma categoria encontrada</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        <div>
                                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                                            {category.description && (
                                                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-2">
                                                Criada em {new Date(category.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="input"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                                            className={`w-8 h-8 rounded-full border-2 ${formData.color === color.value ? 'border-gray-900' : 'border-gray-300'
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.label}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Cor selecionada: {colorOptions.find(c => c.value === formData.color)?.label}
                                </p>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        resetForm()
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCategory ? 'Atualizar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
} 