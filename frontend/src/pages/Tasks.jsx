import { useState, useEffect } from 'react'
import { taskService } from '../services/taskService'
import { categoryService } from '../services/categoryService'
import { Plus, Search, Filter, Edit, Trash2, Users, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Tasks() {
    const [tasks, setTasks] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        category: '',
        is_completed: ''
    })
    const [pagination, setPagination] = useState({
        current: 1,
        total: 0,
        page_size: 10
    })

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        priority: 'medium',
        status: 'pending',
        due_date: '',
        shared_with_ids: []
    })

    useEffect(() => {
        loadTasks()
        loadCategories()
    }, [filters, pagination.current])

    const loadTasks = async () => {
        try {
            setLoading(true)
            const params = {
                ...filters,
                page: pagination.current,
                page_size: pagination.page_size
            }
            const response = await taskService.getTasks(params)
            setTasks(response.results || [])
            setPagination(prev => ({
                ...prev,
                total: response.count || 0
            }))
        } catch (error) {
            toast.error('Erro ao carregar tarefas')
        } finally {
            setLoading(false)
        }
    }

    const loadCategories = async () => {
        try {
            const response = await categoryService.getCategories()
            setCategories(response.results || response || [])
        } catch (error) {
            console.error('Erro ao carregar categorias:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask.id, formData)
                toast.success('Tarefa atualizada com sucesso!')
            } else {
                await taskService.createTask(formData)
                toast.success('Tarefa criada com sucesso!')
            }
            setShowModal(false)
            resetForm()
            loadTasks()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao salvar tarefa')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            try {
                await taskService.deleteTask(id)
                toast.success('Tarefa excluída com sucesso!')
                loadTasks()
            } catch (error) {
                toast.error('Erro ao excluir tarefa')
            }
        }
    }

    const handleToggle = async (id) => {
        try {
            await taskService.toggleTask(id)
            loadTasks()
        } catch (error) {
            toast.error('Erro ao alterar status da tarefa')
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category_id: '',
            priority: 'medium',
            status: 'pending',
            due_date: '',
            shared_with_ids: []
        })
        setEditingTask(null)
    }

    const openEditModal = (task) => {
        setEditingTask(task)
        setFormData({
            title: task.title,
            description: task.description || '',
            category_id: task.category?.id || '',
            priority: task.priority,
            status: task.status,
            due_date: task.due_date ? task.due_date.slice(0, 16) : '',
            shared_with_ids: task.shared_with?.map(u => u.id) || []
        })
        setShowModal(true)
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'text-red-600 bg-red-100'
            case 'high': return 'text-orange-600 bg-orange-100'
            case 'medium': return 'text-yellow-600 bg-yellow-100'
            case 'low': return 'text-green-600 bg-green-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'urgent': return 'Urgente'
            case 'high': return 'Alta'
            case 'medium': return 'Média'
            case 'low': return 'Baixa'
            default: return priority
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Pendente'
            case 'in_progress': return 'Em Progresso'
            case 'completed': return 'Concluída'
            case 'cancelled': return 'Cancelada'
            default: return status
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
                    <p className="text-gray-600">Gerencie suas tarefas</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tarefa
                </button>
            </div>

            {/* Filtros */}
            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="input pl-10"
                                placeholder="Buscar tarefas..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="input"
                        >
                            <option value="">Todos</option>
                            <option value="pending">Pendente</option>
                            <option value="in_progress">Em Progresso</option>
                            <option value="completed">Concluída</option>
                            <option value="cancelled">Cancelada</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                        <select
                            value={filters.priority}
                            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                            className="input"
                        >
                            <option value="">Todas</option>
                            <option value="urgent">Urgente</option>
                            <option value="high">Alta</option>
                            <option value="medium">Média</option>
                            <option value="low">Baixa</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="input"
                        >
                            <option value="">Todas</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Concluída</label>
                        <select
                            value={filters.is_completed}
                            onChange={(e) => setFilters(prev => ({ ...prev, is_completed: e.target.value }))}
                            className="input"
                        >
                            <option value="">Todas</option>
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Tarefas */}
            <div className="card">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma tarefa encontrada</p>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="checkbox"
                                        checked={task.is_completed}
                                        onChange={() => handleToggle(task.id)}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <div>
                                        <h3 className={`text-sm font-medium ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                                        )}
                                        <div className="flex items-center space-x-4 mt-2">
                                            {task.category && (
                                                <span className="text-xs text-gray-500">
                                                    📁 {task.category.name}
                                                </span>
                                            )}
                                            {task.due_date && (
                                                <span className="text-xs text-gray-500 flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(task.due_date).toLocaleDateString()}
                                                </span>
                                            )}
                                            {task.is_shared && (
                                                <span className="text-xs text-blue-500 flex items-center">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    Compartilhada
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                        {getPriorityLabel(task.priority)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {getStatusLabel(task.status)}
                                    </span>
                                    <button
                                        onClick={() => openEditModal(task)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Paginação */}
            {pagination.total > pagination.page_size && (
                <div className="flex justify-center">
                    <nav className="flex items-center space-x-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                            disabled={pagination.current === 1}
                            className="btn-secondary disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-gray-700">
                            Página {pagination.current} de {Math.ceil(pagination.total / pagination.page_size)}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                            disabled={pagination.current >= Math.ceil(pagination.total / pagination.page_size)}
                            className="btn-secondary disabled:opacity-50"
                        >
                            Próxima
                        </button>
                    </nav>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                                    className="input"
                                >
                                    <option value="">Sem categoria</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                                        className="input"
                                    >
                                        <option value="low">Baixa</option>
                                        <option value="medium">Média</option>
                                        <option value="high">Alta</option>
                                        <option value="urgent">Urgente</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                        className="input"
                                    >
                                        <option value="pending">Pendente</option>
                                        <option value="in_progress">Em Progresso</option>
                                        <option value="completed">Concluída</option>
                                        <option value="cancelled">Cancelada</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                                <input
                                    type="datetime-local"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                                    className="input"
                                />
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
                                    {editingTask ? 'Atualizar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
} 