import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Calendar, Edit3, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
    const { user, updateProfile } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        bio: '',
        birth_date: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                bio: user.bio || '',
                birth_date: user.birth_date || ''
            })
        }
    }, [user])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const success = await updateProfile(formData)
            if (success) {
                setIsEditing(false)
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            username: user.username || '',
            email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            bio: user.bio || '',
            birth_date: user.birth_date || ''
        })
        setIsEditing(false)
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
                    <p className="text-gray-600">Gerencie suas informações pessoais</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary flex items-center"
                    >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar Perfil
                    </button>
                )}
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar e Informações Básicas */}
                    <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                            <div className="h-20 w-20 rounded-full bg-primary-500 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {user.first_name?.[0] || user.username?.[0] || 'U'}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {user.first_name} {user.last_name}
                            </h2>
                            <p className="text-gray-500">{user.email}</p>
                            <p className="text-sm text-gray-400">
                                Membro desde {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Campos do Formulário */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome de Usuário
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input pl-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input pl-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="input disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sobrenome
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="input disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Data de Nascimento
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input pl-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Biografia
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            disabled={!isEditing}
                            rows="4"
                            className="input disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="Conte um pouco sobre você..."
                        />
                    </div>

                    {/* Botões de Ação */}
                    {isEditing && (
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn-secondary flex items-center"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex items-center"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Estatísticas do Usuário */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">
                            {user.tasks?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500">Tarefas Criadas</div>
                    </div>
                </div>
                <div className="card">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {user.tasks?.filter(task => task.is_completed)?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500">Tarefas Concluídas</div>
                    </div>
                </div>
                <div className="card">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {user.categories?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500">Categorias Criadas</div>
                    </div>
                </div>
            </div>
        </div>
    )
} 