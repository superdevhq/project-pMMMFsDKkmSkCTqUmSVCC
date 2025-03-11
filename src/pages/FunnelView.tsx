
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Edit } from "lucide-react";
import { FunnelElement } from "@/types/funnel";

const FunnelView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [elements, setElements] = useState<FunnelElement[]>([
    {
      id: "header-1",
      type: "header",
      content: {
        title: "כותרת ראשית מרשימה",
        subtitle: "כותרת משנה שמסבירה את הערך המוצע",
        alignment: "center",
        backgroundColor: "#4F46E5",
        textColor: "#FFFFFF",
      },
    },
    {
      id: "text-1",
      type: "text",
      content: {
        text: "כאן המקום לתוכן שמסביר את הערך של המוצר או השירות שלך. תוכן זה צריך להיות ברור, תמציתי ומשכנע.",
        alignment: "right",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
      },
    },
    {
      id: "cta-1",
      type: "cta",
      content: {
        buttonText: "הירשם עכשיו",
        buttonColor: "#4F46E5",
        buttonTextColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
        alignment: "center",
      },
    },
  ]);

  useEffect(() => {
    // Redirect to editor if this is a new funnel
    if (id === "new") {
      navigate("/funnel/edit/new");
    }
  }, [id, navigate]);

  const getFunnelName = () => {
    if (id === "new") return "משפך חדש";
    return id === "1" ? "קורס דיגיטלי" : id === "2" ? "וובינר" : "חברות VIP";
  };

  const renderElement = (element: FunnelElement) => {
    switch (element.type) {
      case "header":
        return (
          <div
            key={element.id}
            style={{
              backgroundColor: element.content.backgroundColor,
              color: element.content.textColor,
              textAlign: element.content.alignment as any,
              padding: "3rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{element.content.title}</h1>
              <h2 className="text-xl md:text-2xl">{element.content.subtitle}</h2>
            </div>
          </div>
        );
      case "text":
        return (
          <div
            key={element.id}
            style={{
              backgroundColor: element.content.backgroundColor,
              color: element.content.textColor,
              textAlign: element.content.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-6xl mx-auto">
              <p className="text-lg">{element.content.text}</p>
            </div>
          </div>
        );
      case "cta":
        return (
          <div
            key={element.id}
            style={{
              backgroundColor: element.content.backgroundColor,
              textAlign: element.content.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-6xl mx-auto">
              <Button
                style={{
                  backgroundColor: element.content.buttonColor,
                  color: element.content.buttonTextColor,
                }}
                size="lg"
              >
                {element.content.buttonText}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="ml-2" asChild>
            <Link to="/">
              <ArrowRight className="ml-1 h-4 w-4" />
              חזרה לדשבורד
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">תצוגה מקדימה - {getFunnelName()}</h1>
        </div>
        <Button size="sm" asChild>
          <Link to={`/funnel/edit/${id}`}>
            <Edit className="ml-2 h-4 w-4" />
            ערוך משפך
          </Link>
        </Button>
      </header>

      <div className="flex-1">
        {elements.map((element) => renderElement(element))}
      </div>
    </div>
  );
};

export default FunnelView;
