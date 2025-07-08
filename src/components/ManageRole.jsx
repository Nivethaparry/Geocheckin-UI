import React from "react";
import { Container, Navbar, Button, Card, ListGroup } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";

const ManageRole = () => {
  return (
    <Container fluid
      style={{  maxWidth: 400, backgroundColor: "white",  borderRadius: 8, boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        height: "100vh", padding: 0, position: "relative"}} >

      <Navbar
        variant="light"
        className="px-3 py-2 border-bottom"
        style={{ backgroundColor: "white" }} >
        <ArrowLeft style={{ cursor: "pointer" }} />
        <Navbar.Brand className="mx-auto">Manage Role</Navbar.Brand>
      </Navbar>


      <div
        style={{ overflowY: "auto", padding: "1rem", maxHeight: "calc(100vh - 200px)", paddingBottom: "120px" }} >
        {[
          {
            id: 1,
            name: "Admin",
            permissions: ["View Users", "Edit Users", "Approve Leave"]
          },
          {
            id: 2,
            name: "Employee",
            permissions: ["View Users"]
          },
          {
            id: 3,
            name: "Manager",
            permissions: ["View Users", "Approve Leave"]
          }
        ].map((role) => (
          <Card key={role.id} className="mb-3 border-0">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div style={{ flex: "1 1 60%" }}>
                <div style={{ fontWeight: "600" }}>{role.name}</div>
                <div style={{ fontSize: 14, color: "#888" }}>
                  Permissions: {role.permissions.join(", ")}
                </div>
              </div>
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                <Button size="sm" variant="outline-primary">
                  Edit
                </Button>
                <Button size="sm" variant="outline-secondary">
                  Permissions
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>


      <div
        style={{ position: "fixed", bottom: 120, left: "50%", transform: "translateX(-50%)", 
            width: "100%", maxWidth: 400, padding: "10px 20px", zIndex: 1000 }} >
        <Button
          variant="dark"
          className="w-100 d-flex align-items-center justify-content-center"
          style={{ borderRadius: 10 }}
        >
          + Add New Role
        </Button>
      </div>


      <div
        style={{ position: "fixed",  bottom: 60, left: "50%", transform: "translateX(-50%)", width: "100%",
                           maxWidth: 400 ,padding: "10px 20px", zIndex: 1000 }} >
        <Button
          variant="dark"
          className="w-100 d-flex align-items-center justify-content-center"
          style={{ borderRadius: 10 }}>
          Delete Role
        </Button>
      </div>
    </Container>
  );
};

export default ManageRole;





