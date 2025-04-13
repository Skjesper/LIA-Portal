"use client";

import ArrowUp from "@/assets/icons/arrow_up.svg";
import ArrowDown from "@/assets/icons/arrow_down.svg";
import FilterIcon from "@/assets/icons/filter.svg";
import HeartIcon from "@/assets/icons/heart.svg";
import { useState, useEffect } from "react";
import Checkbox from "../Checkbox/Checkbox";
import supabase from "@/utils/supabase/client";

export default function Filter({
  selectedRole,
  setSelectedRole,
  selectedSkills,
  setSelectedSkills,
  showFavorites,
  setShowFavorites,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [professions, setProfessions] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: fetchedProfessions } = await supabase
        .from("professions")
        .select("*");

      const { data: fetchedTechnologies } = await supabase
        .from("technologies")
        .select("id, name, profession_id");

      setProfessions(fetchedProfessions || []);
      setTechnologies(fetchedTechnologies || []);
    };

    fetchData();
  }, []);

  const selectedProfession = professions.find((p) => p.name === selectedRole);

  const filteredTechnologies = technologies.filter(
    (tech) => tech.profession_id === selectedProfession?.id
  );

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      setIsOpen(desktop);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => {
    if (!isDesktop) setIsOpen((prev) => !prev);
  };

  const handleRoleChange = (role) => {
    if (selectedRole === role) {
      setSelectedRole(null);
      setSelectedSkills([]);
    } else {
      setSelectedRole(role);
      setSelectedSkills([]);
    }
  };

  const handleSkillChange = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className={`filter-container ${isOpen ? "open" : ""}`}>
      {!isDesktop && (
        <div className="filter-header" onClick={toggleDropdown}>
          <div className="filter-logo">
            <FilterIcon />
            <span>Filter</span>
          </div>
          {isOpen ? <ArrowUp /> : <ArrowDown />}
        </div>
      )}
      {isOpen && (
        <div className={`filter-content ${isDesktop ? "always-open" : ""}`}>
          <div className="filter-section filter-roles">
            <h3>SÖKER</h3>
            <Checkbox
              variant="filter"
              label="Digital Designer"
              checked={selectedRole === "Digital Designer"}
              onChange={() => handleRoleChange("Digital Designer")}
            />
            <Checkbox
              variant="filter"
              label="Webbutvecklare"
              checked={selectedRole === "Webbutvecklare"}
              onChange={() => handleRoleChange("Webbutvecklare")}
            />
          </div>

          <div className="filter-section filter-skills">
            <h3>ARBETAR MED</h3>
            {selectedRole && (
              <div className="skills-grid">
                {filteredTechnologies.map((tech) => (
                  <button
                    key={tech.id}
                    className={`skill-btn ${
                      selectedSkills.includes(tech.name) ? "selected" : ""
                    }`}
                    onClick={() => handleSkillChange(tech.name)}
                  >
                    {tech.name.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filter-section filter-favorites">
            <h3 className="favorites-heading">
              <HeartIcon className="filter-heart-icon" />
              FAVORITER
            </h3>
            <Checkbox
              label="Visa favoriter"
              variant="filter"
              checked={showFavorites}
              onChange={() => setShowFavorites((prev) => !prev)}
            />
          </div>
        </div>
      )}
    </div>
  );
}