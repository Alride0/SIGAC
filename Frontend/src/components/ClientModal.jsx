import { FiX } from "react-icons/fi";
import AddClients from "./AddClients";

const ClientModal = ({
    show,
    onClose,
    setClients,
    editingClient,
    setEditingClient
}) => {

    if (!show) return null;

    return (
        <div className="modal-overlay">

            <div className="modal-content">

                <div className="modal-header">

                    <h2>
                        {editingClient
                            ? "Modifier un client"
                            : "Nouveau client"}
                    </h2>

                    <button className="modal-close" onClick={onClose}>
                        <FiX size={24}/>
                    </button>

                </div>

                <AddClients
                    setClients={setClients}
                    editingClient={editingClient}
                    setEditingClient={setEditingClient}
                    onSuccess={onClose}
                />

            </div>

        </div>
    );
};

export default ClientModal;