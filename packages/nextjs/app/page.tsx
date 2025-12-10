"use client";

import React from "react";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function VotingPage() {
  const { address } = useAccount();

  // Чтение массива предложений
  const { data: proposals, isLoading: proposalsLoading } = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "getProposals",
  });

  // Чтение статуса "проголосовал ли адрес"
  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "hasVoted",
    args: [address ?? zeroAddress],
  });

  // Чтение текущего победителя
  const { data: winner } = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "getWinner",
  });

  // Хук записи в контракт
  const { writeContractAsync: voteAsync, isMining: voteMining } = useScaffoldWriteContract("Voting");

  const handleVote = async (proposalId: number) => {
    await voteAsync({
      functionName: "vote",
      args: [BigInt(proposalId)],
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">Голосование</h1>

      {!address && <p>Подключите кошелёк, чтобы проголосовать.</p>}

      {proposalsLoading && <p>Загрузка предложений…</p>}

      {proposals && (
        <div className="flex flex-col gap-3">
          {(proposals as any[]).map((proposal: any, index: number) => (
            <div key={index} className="border border-base-300 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  #{index} — {proposal.name}
                </div>
                <div className="text-sm text-gray-500">
                  Голосов: {proposal.voteCount?.toString?.() ?? proposal.voteCount}
                </div>
              </div>

              <button
                className="btn btn-primary"
                disabled={!address || hasVoted || voteMining}
                onClick={() => handleVote(index)}
              >
                {hasVoted ? "Вы уже проголосовали" : "Голосовать"}
              </button>
            </div>
          ))}
        </div>
      )}

      {winner && (
        <div className="border border-success rounded-xl p-4 mt-4">
          <h2 className="font-bold text-lg mb-1">Текущий лидер</h2>
          <p>
            #{winner[0].toString()} — {winner[1]} (голосов: {winner[2].toString()})
          </p>
        </div>
      )}
    </div>
  );
}
