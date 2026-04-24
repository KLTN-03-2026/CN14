import { Button } from "antd"
import { useState } from "react"
import { listCampiagn } from "../../../services/client/campaignServices";
import { useEffect } from "react";

export default function ListCampaign() {

  const [campaigns, setCampaigns] = useState([]);

  const fetchApi = async () => {
    const response = await listCampiagn();

    if (response.code === 200) {
      setCampaigns(response.data);
      console.log(response);

    }
  }

  useEffect(() => {
    fetchApi();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* Promotional Banners */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns && (
            campaigns.map((campaign, index) =>
              <>
                <div key={campaign._id} className="group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                  <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                    <a href={`/campaign/${campaign.slug}`} className="block">
                      <img
                        src={campaign.thumbnail || "/placeholder.svg"}
                        alt={campaign.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </a>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-800 leading-snug px-2"
                    style={{ color: "#FF6600" }}>{campaign.title}</h3>
                </div>
              </>
            )
          )}
        </div>
      </div>

    </div>
  )
}
