"use client";
import React, { useState, useEffect } from 'react';
import { Sword, Shield, User, Home, Truck, ShoppingBag, Plus, Check, X, Trash2, Info } from 'lucide-react';

const RPGTaskManager = () => {
  // Game states
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [coins, setCoins] = useState(0);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', description: '', coins: 5, difficulty: 'easy' });
  const [showRewardInfo, setShowRewardInfo] = useState(false);
  const [avatar, setAvatar] = useState({
    level: 1,
    equipment: { weapon: 'Vara de Madeira', armor: 'Roupa Comum' },
    home: 'Barraca Simples',
    transport: 'A pé'
  });
  
  // Shop items
  const shopItems = {
    weapons: [
      { id: 'w1', name: 'Espada de Ferro', price: 50, level: 2 },
      { id: 'w2', name: 'Lâmina de Aço', price: 120, level: 3 },
      { id: 'w3', name: 'Espada Lendária', price: 300, level: 5 }
    ],
    armor: [
      { id: 'a1', name: 'Armadura de Couro', price: 75, level: 2 },
      { id: 'a2', name: 'Armadura de Ferro', price: 160, level: 3 },
      { id: 'a3', name: 'Armadura Encantada', price: 350, level: 5 }
    ],
    homes: [
      { id: 'h1', name: 'Cabana de Madeira', price: 100, level: 2 },
      { id: 'h2', name: 'Casa de Pedra', price: 250, level: 3 },
      { id: 'h3', name: 'Mansão', price: 500, level: 5 }
    ],
    transport: [
      { id: 't1', name: 'Cavalo', price: 80, level: 2 },
      { id: 't2', name: 'Carruagem', price: 200, level: 3 },
      { id: 't3', name: 'Montaria Mágica', price: 400, level: 5 }
    ]
  };
  
  // Sample tasks by difficulty to suggest
  const sampleTasks = {
    easy: [
      { name: 'Responder e-mails', coins: 5 },
      { name: 'Organizar mesa de trabalho', coins: 5 },
      { name: 'Fazer lista de compras', coins: 3 }
    ],
    medium: [
      { name: 'Preparar apresentação', coins: 15 },
      { name: 'Ler capítulo de livro', coins: 10 },
      { name: 'Organizar arquivos', coins: 12 }
    ],
    hard: [
      { name: 'Escrever relatório completo', coins: 25 },
      { name: 'Estudar para prova', coins: 30 },
      { name: 'Concluir projeto', coins: 35 }
    ]
  };
  
  // Load saved state
  useEffect(() => {
    const savedState = localStorage.getItem('rpgTaskManager');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setTasks(parsedState.tasks || []);
      setCompletedTasks(parsedState.completedTasks || []);
      setCoins(parsedState.coins || 0);
      setAvatar(parsedState.avatar || {
        level: 1,
        equipment: { weapon: 'Vara de Madeira', armor: 'Roupa Comum' },
        home: 'Barraca Simples',
        transport: 'A pé'
      });
    }
  }, []);
  
  // Save state when it changes
  useEffect(() => {
    localStorage.setItem('rpgTaskManager', JSON.stringify({
      tasks,
      completedTasks,
      coins,
      avatar
    }));
  }, [tasks, completedTasks, coins, avatar]);
  
  // Calculate avatar level based on completed tasks
  useEffect(() => {
    const newLevel = Math.floor(completedTasks.length / 5) + 1;
    if (newLevel !== avatar.level) {
      setAvatar(prev => ({ ...prev, level: newLevel }));
    }
  }, [completedTasks, avatar.level]);
  
  // Handle new task difficulty change
  const handleDifficultyChange = (difficulty) => {
    let coinValue = 5;
    if (difficulty === 'medium') coinValue = 15;
    if (difficulty === 'hard') coinValue = 30;
    
    setNewTask(prev => ({ ...prev, difficulty, coins: coinValue }));
  };
  
  // Add new task
  const addTask = () => {
    if (newTask.name.trim() === '') return;
    if (newTask.coins > 50) {
      alert('Uma tarefa não pode valer mais de 50 moedas. Considere dividir em tarefas menores!');
      return;
    }
    
    setTasks(prev => [...prev, { 
      ...newTask, 
      id: Date.now().toString(), 
      createdAt: new Date().toISOString() 
    }]);
    setNewTask({ name: '', description: '', coins: 5, difficulty: 'easy' });
    setShowNewTaskForm(false);
  };
  
  // Complete task
  const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setCoins(prev => prev + task.coins);
    setCompletedTasks(prev => [...prev, { ...task, completedAt: new Date().toISOString() }]);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  
  // Delete task
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  
  // Buy item
  const buyItem = (item, category) => {
    if (coins < item.price) {
      alert('Você não tem moedas suficientes para comprar este item!');
      return;
    }
    
    setCoins(prev => prev - item.price);
    
    if (category === 'weapons') {
      setAvatar(prev => ({ ...prev, equipment: { ...prev.equipment, weapon: item.name } }));
    } else if (category === 'armor') {
      setAvatar(prev => ({ ...prev, equipment: { ...prev.equipment, armor: item.name } }));
    } else if (category === 'homes') {
      setAvatar(prev => ({ ...prev, home: item.name }));
    } else if (category === 'transport') {
      setAvatar(prev => ({ ...prev, transport: item.name }));
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">RPG Task Manager</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500 px-3 py-1 rounded-full">
              {coins} moedas
            </div>
            <button 
              onClick={() => setShowInventory(!showInventory)}
              className="bg-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-800 transition"
            >
              {showInventory ? 'Tarefas' : 'Inventário'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Avatar Status */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <User size={32} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Aventureiro Nível {avatar.level}</h2>
                <p className="text-gray-600">{completedTasks.length} missões completadas</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-3">
              <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <Sword size={16} className="mr-1" /> {avatar.equipment.weapon}
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <Shield size={16} className="mr-1" /> {avatar.equipment.armor}
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <Home size={16} className="mr-1" /> {avatar.home}
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <Truck size={16} className="mr-1" /> {avatar.transport}
              </div>
            </div>
          </div>
        </div>
        
        {!showInventory ? (
          /* Tasks List View */
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Suas Missões</h2>
              <button 
                onClick={() => setShowNewTaskForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center"
              >
                <Plus size={18} className="mr-1" /> Nova Missão
              </button>
            </div>
            
            {tasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 mb-4">Você não tem missões ativas.</p>
                <button 
                  onClick={() => setShowNewTaskForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Criar Sua Primeira Missão
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className={`p-1 ${
                      task.difficulty === 'easy' ? 'bg-green-500' : 
                      task.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{task.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                          {task.coins} moedas
                        </span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => completeTask(task.id)}
                            className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Completed tasks */}
            {completedTasks.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Missões Completadas</h2>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="divide-y">
                    {completedTasks.slice(-5).map(task => (
                      <div key={task.id} className="py-2 flex justify-between items-center">
                        <div>
                          <span className="font-medium">{task.name}</span>
                          <span className="text-gray-500 text-sm ml-2">
                            {new Date(task.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                          +{task.coins} moedas
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Inventory/Shop View */
          <div>
            <h2 className="text-xl font-bold mb-4">Loja do Aventureiro</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weapons */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-indigo-600 text-white p-3 flex items-center">
                  <Sword size={20} className="mr-2" />
                  <h3 className="font-bold">Armas</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">Equipamento atual: <span className="font-semibold">{avatar.equipment.weapon}</span></p>
                  <div className="space-y-3">
                    {shopItems.weapons.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 text-xs ml-2">Nível {item.level}</span>
                        </div>
                        <button
                          onClick={() => buyItem(item, 'weapons')}
                          disabled={coins < item.price || avatar.equipment.weapon === item.name}
                          className={`px-3 py-1 rounded text-sm ${
                            coins < item.price || avatar.equipment.weapon === item.name
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {avatar.equipment.weapon === item.name ? 'Equipado' : `${item.price} moedas`}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Armor */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-indigo-600 text-white p-3 flex items-center">
                  <Shield size={20} className="mr-2" />
                  <h3 className="font-bold">Armaduras</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">Equipamento atual: <span className="font-semibold">{avatar.equipment.armor}</span></p>
                  <div className="space-y-3">
                    {shopItems.armor.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 text-xs ml-2">Nível {item.level}</span>
                        </div>
                        <button
                          onClick={() => buyItem(item, 'armor')}
                          disabled={coins < item.price || avatar.equipment.armor === item.name}
                          className={`px-3 py-1 rounded text-sm ${
                            coins < item.price || avatar.equipment.armor === item.name
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {avatar.equipment.armor === item.name ? 'Equipado' : `${item.price} moedas`}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Homes */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-indigo-600 text-white p-3 flex items-center">
                  <Home size={20} className="mr-2" />
                  <h3 className="font-bold">Moradias</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">Moradia atual: <span className="font-semibold">{avatar.home}</span></p>
                  <div className="space-y-3">
                    {shopItems.homes.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 text-xs ml-2">Nível {item.level}</span>
                        </div>
                        <button
                          onClick={() => buyItem(item, 'homes')}
                          disabled={coins < item.price || avatar.home === item.name}
                          className={`px-3 py-1 rounded text-sm ${
                            coins < item.price || avatar.home === item.name
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {avatar.home === item.name ? 'Obtido' : `${item.price} moedas`}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Transport */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-indigo-600 text-white p-3 flex items-center">
                  <Truck size={20} className="mr-2" />
                  <h3 className="font-bold">Transportes</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">Transporte atual: <span className="font-semibold">{avatar.transport}</span></p>
                  <div className="space-y-3">
                    {shopItems.transport.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 text-xs ml-2">Nível {item.level}</span>
                        </div>
                        <button
                          onClick={() => buyItem(item, 'transport')}
                          disabled={coins < item.price || avatar.transport === item.name}
                          className={`px-3 py-1 rounded text-sm ${
                            coins < item.price || avatar.transport === item.name
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {avatar.transport === item.name ? 'Obtido' : `${item.price} moedas`}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* New Task Modal */}
      {showNewTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowNewTaskForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Nova Missão</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Missão
                  </label>
                  <input
                    type="text"
                    value={newTask.name}
                    onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="O que você precisa fazer?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Detalhes adicionais..."
                    rows="2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dificuldade
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      className={`p-2 rounded text-center ${
                        newTask.difficulty === 'easy'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => handleDifficultyChange('easy')}
                    >
                      Fácil
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded text-center ${
                        newTask.difficulty === 'medium'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => handleDifficultyChange('medium')}
                    >
                      Média
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded text-center ${
                        newTask.difficulty === 'hard'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => handleDifficultyChange('hard')}
                    >
                      Difícil
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Recompensa (moedas)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRewardInfo(!showRewardInfo)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                    >
                      <Info size={16} className="mr-1" /> Exemplos
                    </button>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newTask.coins}
                    onChange={(e) => setNewTask(prev => ({ ...prev, coins: parseInt(e.target.value) || 0 }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Máximo: 50 moedas. Divida tarefas maiores em partes menores.
                  </p>
                </div>
                
                {/* Reward suggestions */}
                {showRewardInfo && (
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h4 className="font-medium text-sm mb-2">Exemplos de tarefas por dificuldade:</h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <p className="font-medium text-green-600">Fácil (3-5 moedas):</p>
                        <ul className="pl-5 list-disc">
                          {sampleTasks.easy.map((task, index) => (
                            <li key={index}>{task.name} - {task.coins} moedas</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-yellow-600">Média (10-15 moedas):</p>
                        <ul className="pl-5 list-disc">
                          {sampleTasks.medium.map((task, index) => (
                            <li key={index}>{task.name} - {task.coins} moedas</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-red-600">Difícil (25-35 moedas):</p>
                        <ul className="pl-5 list-disc">
                          {sampleTasks.hard.map((task, index) => (
                            <li key={index}>{task.name} - {task.coins} moedas</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewTaskForm(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={addTask}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Criar Missão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RPGTaskManager;