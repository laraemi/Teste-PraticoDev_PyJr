import { useState, useEffect } from 'react'
import { taskService } from '../services/taskService'
import { CheckSquare, Clock, AlertTriangle, Users } from 'lucide-react'

export default function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        shared: 0
    })
    const [recentTasks, setRecentTasks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            const [tasksResponse, myTasksResponse, sharedTasksResponse] = await Promise.all([
                taskService.getTasks({ page_size: 5 }),
                taskService.getMyTasks({ page_size: 5 }),
                taskService.getSharedTasks({ page_size: 5 })
            ])

            const allTasks = tasksResponse.results || []
            const myTasks = myTasksResponse.results || []
            const sharedTasks = sharedTasksResponse.results || []

            // Calcular estatísticas
            const total = allTasks.length
            const completed = allTasks.filter(task => task.is_completed).length
            const pending = allTasks.filter(task => !task.is_completed).length
            const overdue = allTasks.filter(task => task.is_overdue).length
            const shared = sharedTasks.length

            setStats({ total, completed, pending, overdue, shared })
            setRecentTasks(allTasks.slice(0, 5))
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error)
        } finally {
            setLoading(false)
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Visão geral das suas tarefas</p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="card">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CheckSquare className="h-8 w-8 text-primary-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CheckSquare className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Concluídas</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Pendentes</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Atrasadas</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.overdue}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Compartilhadas</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.shared}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarefas Recentes */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tarefas Recentes</h2>
                {recentTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma tarefa encontrada</p>
                ) : (
                    <div className="space-y-4">
                        {recentTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="checkbox"
                                        checked={task.is_completed}
                                        onChange={() => taskService.toggleTask(task.id).then(loadDashboardData)}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <div>
                                        <h3 className={`text-sm font-medium ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                            {task.title}
                                        </h3>
                                        {task.category && (
                                            <p className="text-xs text-gray-500">
                                                Categoria: {task.category.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                        {getPriorityLabel(task.priority)}
                                    </span>
                                    {task.is_shared && (
                                        <Users className="h-4 w-4 text-blue-500" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 