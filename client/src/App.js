import { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const API =process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function App() {
  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({ name: "", age: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    const res = await axios.get(API);
    setPeople(res.data);
  };

  const addPerson = async () => {
    if (!form.name || !form.age) return alert("Enter name & age");
    const res = await axios.post(API, { name: form.name, age: Number(form.age) });
    setPeople([...people, res.data]);
    setForm({ name: "", age: "" });
  };

  const startEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, age: p.age });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updatePerson = async () => {
    const res = await axios.put(`${API}/${editId}`, form);
    setPeople(people.map(p => (p._id === editId ? res.data : p)));
    setEditId(null);
    setForm({ name: "", age: "" });
  };

  const deletePerson = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await axios.delete(`${API}/${id}`);
    setPeople(people.filter(p => p._id !== id));
  };

  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">People Manager</h1>
        <p className="text-muted">Simple CRUD with Node & React</p>
      </div>

      {/* Form Card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <h5 className="card-title mb-3">
            {editId ? "✏️ Edit Person" : "➕ Add New Person"}
          </h5>
          <div className="row g-2">
            <div className="col-md-7">
              <input
                className="form-control"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Age"
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>
            <div className="col-md-2 d-grid">
              {editId ? (
                <button className="btn btn-warning text-white" onClick={updatePerson}>Update</button>
              ) : (
                <button className="btn btn-primary" onClick={addPerson}>Add</button>
              )}
            </div>
          </div>
          {editId && (
            <button 
              className="btn btn-link btn-sm text-secondary mt-2" 
              onClick={() => { setEditId(null); setForm({ name: "", age: "" }); }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* List Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h6 className="mb-0 fw-bold">Recent Entries ({people.length})</h6>
        </div>
        <ul className="list-group list-group-flush">
          {people.length === 0 ? (
            <li className="list-group-item text-center py-4 text-muted small">
              No records found.
            </li>
          ) : (
            people.map((p) => (
              <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                  <span className="fw-bold d-block">{p.name}</span>
                  <small className="text-muted">{p.age} years old</small>
                </div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-info px-3" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger px-3" onClick={() => deletePerson(p._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}