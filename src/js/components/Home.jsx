import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Task = ({ id, label, onDelete }) => {
	const [beVisible, setBeVisible] = useState(false)

	return <li
		className="list-group-item d-flex justify-content-between align-items-center"
		onMouseEnter={() => setBeVisible(true)}
		onMouseLeave={() => setBeVisible(false)}
	>
		{label}
		{beVisible && <button
			className="btn btn-sm btn-outline-danger border-0"
			onClick={() => onDelete(id)
			}
		>
			<FontAwesomeIcon icon={faTrash} />
		</button>
		}
	</li>
}

const Home = () => {
	const [inputValue, setInputValue] = useState("")
	const [list, setList] = useState([])

	useEffect(() => {

		const getContent = async () => {

			try {

				await fetch("https://playground.4geeks.com/todo/users/kendallsh", {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})

				const response = await fetch("https://playground.4geeks.com/todo/users/kendallsh")
				if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

				const data = await response.json()
				setList(data.todos || [])
			} catch (error) {
				console.error(error);
			}
		}
		getContent()
	}, [])

	const addTodo = async (input) => {
		try {
			const response = await fetch('https://playground.4geeks.com/todo/todos/kendallsh', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ label: input, is_done: false })
			});
			if (!response.ok) throw new Error(`Error al crear: ${response.status}`)

			const data = await response.json();
			console.log('Task create:', data);
			return data;
		} catch (error) {
			console.error('Error en el POST:', error.message);
			throw error
		}
	};

	const deleteTodo = async (todoId) => {

		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
				method: "DELETE"
			});
			if (!response.ok) throw new Error(`Error al eliminar: ${response.status}`)

			setList(list.filter((listItem) => listItem.id !== todoId))
		} catch (error) {
			console.error('Error en el DELETE:', error.message);
		}
	}
	
	const deleteAll = async () => {

		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/kendallsh" , {
				method: "DELETE"
			})
			if (!response.ok) throw new Error(`Error al eliminar: ${response.status}`)
			
			setList([])

			await fetch("https://playground.4geeks.com/todo/users/kendallsh", {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})

			console.log("Todas las tareas fueron eliminadas.");

		} catch (error) {
			console.error('Error al eliminar todas las tareas:', error.message);
		}
	}

	const handleSubmit = async (evn) => {
		evn.preventDefault();
		if (inputValue.trim() === "") return;

		const currentInput = inputValue;
		setInputValue("");

		try {

			const newTodoFromServer = await addTodo(currentInput);

			setList([
				...list,
				newTodoFromServer
			]);
		} catch (error) {
			console.error("No se pudo guardar en el servidor:", error)
			setInputValue(currentInput);
		}
	}

	return (
		<div className="d-flex justify-content-center mt-5">
			<div className="card shadow-sm d-inline-block">
				<div className="card-body">

					<h2 className="text-center mb-4">To-Do List</h2>

					<form onSubmit={handleSubmit}>
						<input
							type="text"
							className="form-control form-control-lg mb-4"
							value={inputValue}
							onChange={(evn) => setInputValue(evn.target.value)}
						/>
					</form>
					<ul className="list-group gap-2">
						{list.map((item) => (
							<Task
								key={item.id}
								id={item.id}
								label={item.label}
								onDelete={deleteTodo}
							/>
						))}
					</ul>

				</div>
				<div className="container text-muted ">
					{list.length === 0 ? "No hay tareas, añadir tareas" : null}
				</div>
				<div className="card-footer text-muted small">
					<div className="container-fluid">
					{list.length} {list.length === 1 ? "item" : "items"} left
					<button
						type="button"
						class="btn btn-danger m-4"
						onClick={deleteAll}
					>
						DeleteAll
					</button>
					</div>

				</div>
			</div>
		</div>
	);
};

export default Home;
